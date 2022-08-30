import { SendUtxoTransaction } from "@contexts/ConnectedWallet/Provider";
import { NEVMInfo, UTXOInfo } from "@contexts/ConnectedWallet/types";
import { Dispatch } from "react";
import { SPVProof, syscoin, utils as syscoinUtils } from "syscoinjs-lib";
import { BlockbookAPIURL, SYSX_ASSET_GUID } from "../constants";
import burnSysToSysx from "./burnSysToSysx";
import burnSysx from "./burnSysx";
import { addLog, setStatus, TransferActions } from "../store/actions";
import { ITransfer } from "../types";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { getProof } from "bitcoin-proof";
import { TransactionReceipt } from "web3-core";

type SysToNevmStateMachineParams = {
  transfer: ITransfer;
  syscoinInstance: syscoin;
  web3: Web3;
  utxo: Partial<UTXOInfo>;
  dispatch: Dispatch<TransferActions>;
  sendUtxoTransaction: SendUtxoTransaction;
  nevm: Partial<NEVMInfo>;
  relayContract: Contract;
  confirmTransaction: (
    chain: "nevm" | "utxo",
    transactionHash: string,
    duration?: number,
    confirmations?: number
  ) => Promise<syscoinUtils.BlockbookTransactionBTC | TransactionReceipt>;
};

const runWithSysToNevmStateMachine = async (
  params: SysToNevmStateMachineParams
) => {
  const {
    transfer,
    syscoinInstance,
    web3,
    dispatch,
    nevm,
    relayContract,
    sendUtxoTransaction,
    utxo,
    confirmTransaction,
  } = params;
  switch (transfer.status) {
    case "burn-sys": {
      if (transfer.logs.some((l) => l.status === "burn-sys")) {
        return dispatch(setStatus("burn-sysx"));
      }
      const burnSysTransaction = await burnSysToSysx(
        syscoinInstance,
        parseFloat(transfer.amount).toFixed(6),
        utxo.xpub!,
        transfer.utxoAddress!
      );
      await sendUtxoTransaction(burnSysTransaction)
        .then((burnSysTransactionReceipt) => {
          console.log("burn-sys", burnSysTransactionReceipt, new Date());
          dispatch(
            addLog("burn-sys", "Burning SYS to SYSX", burnSysTransactionReceipt)
          );
          dispatch(setStatus("confirm-burn-sys"));
        })
        .catch((error) => {
          console.error("burn-sys error", error);
          return Promise.reject(error);
        });
      break;
    }

    case "confirm-burn-sys": {
      const { tx } = transfer.logs.find((log) => log.status === "burn-sys")
        ?.payload.data;
      const transactionRaw = await confirmTransaction("utxo", tx, 0, 0);
      if (!transactionRaw) {
        return;
      }
      dispatch(setStatus("burn-sysx"));
      break;
    }

    case "burn-sysx": {
      const burnSysxTransaction = await burnSysx(
        syscoinInstance,
        transfer.amount,
        SYSX_ASSET_GUID,
        utxo.account!,
        utxo.xpub!,
        nevm.account!.replace(/^0x/g, "")
      );
      await sendUtxoTransaction(burnSysxTransaction)
        .then((burnSysxTransactionReceipt) => {
          dispatch(
            addLog(
              "burn-sysx",
              "Burning SYSX to NEVM",
              burnSysxTransactionReceipt
            )
          );
          dispatch(setStatus("confirm-burn-sysx"));
        })
        .catch((error) => {
          console.error("burn-sysx error", error);
          return Promise.reject(error);
        });
      break;
    }

    case "confirm-burn-sysx": {
      const { tx } = transfer.logs.find((log) => log.status === "burn-sysx")
        ?.payload.data;
      const transactionRaw = await confirmTransaction("utxo", tx);
      if (!transactionRaw) {
        return;
      }
      dispatch(setStatus("generate-proofs"));
      break;
    }

    case "generate-proofs": {
      console.log("Fetching backednd proof");
      const { tx } = transfer.logs.find((log) => log.status === "burn-sysx")
        ?.payload.data;
      const proof = await syscoinUtils.fetchBackendSPVProof(
        BlockbookAPIURL,
        tx
      );
      if (proof.result === "") {
        throw new Error("Proof not yet available");
      }
      const results = JSON.parse(proof.result) as SPVProof;
      dispatch(addLog("generate-proofs", "Submitting proofs", { results }));
      dispatch(setStatus("submit-proofs"));
      break;
    }

    case "submit-proofs": {
      const proof = transfer.logs.find(
        (log) => log.status === "generate-proofs"
      )?.payload.data.results as SPVProof;
      const nevmBlock = await web3.eth.getBlock(`0x${proof.nevm_blockhash}`);
      const txBytes = `0x${proof.transaction}`;
      const txIndex = proof.index;
      const merkleProof = getProof(proof.siblings, txIndex);
      merkleProof.sibling = merkleProof.sibling.map(
        (sibling) => `0x${sibling}`
      );
      const syscoinBlockheader = `0x${proof.header}`;
      return new Promise((resolve, reject) => {
        relayContract.methods
          .relayTx(
            nevmBlock.number,
            txBytes,
            txIndex,
            merkleProof.sibling,
            syscoinBlockheader
          )
          .send({
            from: nevm.account!,
            gas: 400000,
          })
          .once("transactionHash", (hash: string) => {
            dispatch(
              addLog("submit-proofs", "Transaction hash", {
                hash,
              })
            );
            dispatch(setStatus("finalizing"));
            resolve(hash);
          })
          .on("error", (error: { message: string }) => {
            if (/might still be mined/.test(error.message)) {
              dispatch(setStatus("completed"));
              resolve("");
            } else {
              dispatch(
                addLog("error", error.message ?? "Proof error", {
                  error,
                })
              );
              reject(error.message);
            }
          });
      });
    }
    case "finalizing":
      {
        const submitProofLog = transfer.logs.find(
          (log) => log.status === "submit-proofs"
        );
        const submitProofsHash = submitProofLog?.payload.data.hash;
        if (!submitProofsHash) {
          console.error("submit-proofs hash not found");
          return;
        }
        const receipt = await confirmTransaction("nevm", submitProofsHash);
        dispatch(
          addLog("finalizing", "Transaction Receipt", {
            receipt,
          })
        );
        dispatch(setStatus("completed"));
      }
      break;
    default:
      return;
  }
};

export default runWithSysToNevmStateMachine;
