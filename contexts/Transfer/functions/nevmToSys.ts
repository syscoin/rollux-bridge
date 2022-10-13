import { Dispatch } from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { TransactionReceipt } from "web3-core";
import SyscoinERC20ManagerABI from "../abi/SyscoinERC20Manager";
import { SYSX_ASSET_GUID } from "../constants";
import { addLog, setStatus, TransferActions } from "../store/actions";
import { ITransfer } from "../types";
import { syscoin, utils } from "syscoinjs-lib";
import { UTXOInfo } from "@contexts/ConnectedWallet/types";
import { SendUtxoTransaction } from "@contexts/ConnectedWallet/Provider";
import burnSysx from "./burnSysx";
import { toWei } from "web3-utils";

const freezeAndBurn = (
  contract: Contract,
  transfer: ITransfer,
  utxo: Partial<UTXOInfo>,
  dispatch: Dispatch<TransferActions>
) => {
  const amount = toWei(transfer.amount.toString(), "ether");
  if (utxo?.xpub !== transfer.utxoAddress) {
    return Promise.reject(
      "Invalid freeze and burn, uxto address does not match"
    );
  }
  return new Promise((resolve, reject) => {
    contract.methods
      .freezeBurnERC20(amount, SYSX_ASSET_GUID, utxo.account)
      .send({ from: transfer.nevmAddress, gas: 400000, value: amount })
      .once("transactionHash", (transactionHash: string) => {
        dispatch(
          addLog("freeze-burn-sys", "Freeze and Burn SYS", transactionHash)
        );
        dispatch(setStatus("confirm-freeze-burn-sys"));
        resolve(transactionHash);
      })
      .on("error", (error: { message: string }) => {
        if (/might still be mined/.test(error.message)) {
          dispatch(setStatus("confirm-freeze-burn-sys"));
        } else {
          dispatch(
            addLog("error", "Freeze and Burn error", {
              error,
            })
          );
          reject(error.message);
        }
      });
  });
};

const confirmFreezeAndBurnSys = async (
  transfer: ITransfer,
  confirmTransaction: (
    chain: "nevm" | "utxo",
    txid: string,
    duration?: number
  ) => Promise<utils.BlockbookTransactionBTC | TransactionReceipt>,
  dispatch: Dispatch<TransferActions>
) => {
  const freezeBurnLog = transfer.logs.find(
    (log) => log.status === "freeze-burn-sys"
  );
  if (!freezeBurnLog) {
    return;
  }
  const transactionHash = freezeBurnLog.payload.data as string;
  try {
    const receipt = await confirmTransaction("nevm", transactionHash);
    if (!receipt) {
      return;
    }
    dispatch(
      addLog("confirm-freeze-burn-sys", "Confirm Freeze and Burn SYS", receipt)
    );
    return dispatch(setStatus("mint-sysx"));
  } catch (error) {
    dispatch(
      addLog("error", "Confirm Freeze and Burn error", {
        error,
      })
    );
    dispatch(setStatus("error"));
  }
};

const mintSysx = async (
  transfer: ITransfer,
  syscoinInstance: syscoin,
  utxo: Partial<UTXOInfo>,
  dispatch: Dispatch<TransferActions>,
  sendUtxoTransaction: SendUtxoTransaction
) => {
  const freezeBurnConfirmationLog = transfer.logs.find(
    (log) => log.status === "confirm-freeze-burn-sys"
  );
  if (!freezeBurnConfirmationLog) {
    return;
  }
  const receipt = freezeBurnConfirmationLog.payload.data as TransactionReceipt;

  const feeRate = new utils.BN(10);
  const txOpts = { rbf: true };
  // web3 URL + ID and nevm burn txid
  const assetOpts = {
    web3url: "https://rpc.syscoin.org",
    ethtxid: receipt.transactionHash,
  };
  // will be auto filled based on ethtxid eth-proof
  const assetMap = null;
  console.log("assetAllocationMint", {
    assetOpts,
    txOpts,
    assetMap,
    utxoAddress: utxo.account,
    feeRate,
    xpub: utxo.xpub,
  });
  const res = await syscoinInstance.assetAllocationMint(
    assetOpts,
    txOpts,
    assetMap,
    utxo.account,
    feeRate,
    utxo.xpub
  );
  if (!res) {
    dispatch(addLog("mint-sysx", "Mint SYS error: Not enough funds", res));
    return dispatch(setStatus("error"));
  }
  console.log("assetAllocationMint received", {
    res,
  });
  const transaction = utils.exportPsbtToJson(res.psbt, res.assets);
  const mintSysxTransactionReceipt = await sendUtxoTransaction(transaction);
  dispatch(addLog("mint-sysx", "Mint Sysx", mintSysxTransactionReceipt));
  dispatch(setStatus("confirm-mint-sysx"));
};

const burnSysxToSys = async (
  transfer: ITransfer,
  utxo: Partial<UTXOInfo>,
  syscoinInstance: syscoin,
  dispatch: Dispatch<TransferActions>,
  sendUtxoTransaction: SendUtxoTransaction
) => {
  let transaction = null;

  try {
    transaction = await burnSysx(
      syscoinInstance,
      transfer.amount,
      SYSX_ASSET_GUID,
      utxo.account!,
      utxo.xpub!,
      ""
    );
  } catch (e) {
    dispatch(addLog("mint-sysx", "Mint SYS error: Not enough funds", null));
    return dispatch(setStatus("error"));
  }

  const burnSysxTransactionReceipt = await sendUtxoTransaction(transaction);
  dispatch(addLog("burn-sysx", "Burn Sysx", burnSysxTransactionReceipt));
  dispatch(setStatus("finalizing"));
};

const runWithNevmToSysStateMachine = async (
  transfer: ITransfer,
  web3: Web3,
  syscoinInstance: syscoin,
  utxo: Partial<UTXOInfo>,
  sendUtxoTransaction: SendUtxoTransaction,
  dispatch: Dispatch<TransferActions>,
  confirmTransaction: (
    chain: "nevm" | "utxo",
    transactionHash: string,
    duration?: number,
    confirmations?: number
  ) => Promise<utils.BlockbookTransactionBTC | TransactionReceipt>
) => {
  const erc20Manager = new web3.eth.Contract(
    SyscoinERC20ManagerABI,
    "0xA738a563F9ecb55e0b2245D1e9E380f0fE455ea1"
  );
  switch (transfer.status) {
    case "freeze-burn-sys": {
      return freezeAndBurn(erc20Manager, transfer, utxo, dispatch);
    }
    case "confirm-freeze-burn-sys": {
      return confirmFreezeAndBurnSys(transfer, confirmTransaction, dispatch);
    }
    case "mint-sysx": {
      return mintSysx(
        transfer,
        syscoinInstance,
        utxo,
        dispatch,
        sendUtxoTransaction
      );
    }

    case "confirm-mint-sysx": {
      const { tx } = transfer.logs.find((log) => log.status === "mint-sysx")
        ?.payload.data;
      const transactionRaw = await confirmTransaction("utxo", tx, 0, 0);
      if (!transactionRaw) {
        return;
      }
      dispatch(setStatus("burn-sysx"));

      break;
    }

    case "burn-sysx": {
      return burnSysxToSys(
        transfer,
        utxo,
        syscoinInstance,
        dispatch,
        sendUtxoTransaction
      );
    }

    case "finalizing": {
      const transactionLog = transfer.logs.find(
        (log) => log.status === "burn-sysx"
      );
      const txId = transactionLog?.payload.data.tx;
      const transaction = await confirmTransaction("utxo", txId);
      dispatch(
        addLog("finalizing", "Transaction Receipt", {
          transaction,
        })
      );
      dispatch(setStatus("completed"));
    }

    default:
      return;
  }
};

export default runWithNevmToSysStateMachine;
