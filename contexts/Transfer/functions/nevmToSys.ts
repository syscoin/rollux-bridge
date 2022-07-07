import { Dispatch } from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { TransactionReceipt } from "web3-core";
import SyscoinERC20ManagerABI from "../abi/SyscoinERC20Manager";
import { SYSX_ASSET_GUID } from "../constants";
import { addLog, setStatus, TransferActions } from "../store/actions";
import { ITransfer } from "../types";
import { syscoin, utils } from "syscoinjs-lib";
import BN from "bn.js";
import { UTXOInfo } from "@contexts/ConnectedWallet/types";
import { SendUtxoTransaction } from "@contexts/ConnectedWallet/Provider";
import burnSysx from "./burnSysx";
import { toWei } from "web3-utils";

const freezeAndBurn = (
  contract: Contract,
  transfer: ITransfer,
  dispatch: Dispatch<TransferActions>
) => {
  const amount = toWei(transfer.amount.toString(), "ether");
  contract.methods
    .freezeBurnERC20(amount, SYSX_ASSET_GUID, transfer.utxoAddress)
    .send({ from: transfer.nevmAddress, gas: 400000, value: amount })
    .once("transactionHash", (transactionHash: string) => {
      dispatch(
        addLog("freeze-burn-sys", "Freeze and Burn SYS", transactionHash)
      );
      dispatch(setStatus("confirm-freeze-burn-sys"));
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
        dispatch(setStatus("error"));
      }
    });
};

const confirmFreezeAndBurnSys = async (
  transfer: ITransfer,
  web3: Web3,
  dispatch: Dispatch<TransferActions>
) => {
  const freezeBurnLog = transfer.logs.find(
    (log) => log.status === "freeze-burn-sys"
  );
  if (!freezeBurnLog) {
    return;
  }
  const transactionHash = freezeBurnLog.payload.data as string;
  const receipt = await web3.eth.getTransactionReceipt(transactionHash);
  if (!receipt) {
    return;
  }
  if (receipt.status === true) {
    dispatch(
      addLog("confirm-freeze-burn-sys", "Confirm Freeze and Burn SYS", receipt)
    );
    return dispatch(setStatus("mint-sysx"));
  }
  dispatch(
    addLog("error", "Confirm Freeze and Burn error", {
      receipt,
    })
  );
  dispatch(setStatus("error"));
};

const mintSysx = async (
  transfer: ITransfer,
  syscoinInstance: syscoin,
  uxto: Partial<UTXOInfo>,
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

  const feeRate = new BN(10);
  const txOpts = { rbf: true };
  // web3 URL + ID and nevm burn txid
  const assetOpts = {
    web3url: "https://rpc.syscoin.org",
    ethtxid: receipt.transactionHash,
  };
  // will be auto filled based on ethtxid eth-proof
  const assetMap = null;
  const res = await syscoinInstance.assetAllocationMint(
    assetOpts,
    txOpts,
    assetMap,
    transfer.utxoAddress,
    feeRate,
    uxto.xpub
  );
  if (!res) {
    dispatch(addLog("mint-sysx", "Mint SYS error: Not enough funds", res));
    return dispatch(setStatus("error"));
  }
  const transaction = utils.exportPsbtToJson(res.psbt, res.assets);
  const mintSysxTransactionReceipt = await sendUtxoTransaction(transaction);
  dispatch(addLog("mint-sysx", "Mint Sysx", mintSysxTransactionReceipt));
  setTimeout(() => dispatch(setStatus("burn-sysx")), 3000);
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
      transfer.utxoAddress!,
      utxo.xpub!,
      ""
    );
  } catch (e) {
    dispatch(addLog("mint-sysx", "Mint SYS error: Not enough funds", null));
    return dispatch(setStatus("error"));
  }

  const burnSysxTransactionReceipt = await sendUtxoTransaction(transaction);
  dispatch(addLog("burn-sysx", "Burn Sysx", burnSysxTransactionReceipt));
  setTimeout(() => dispatch(setStatus("completed")), 3000);
};

const runWithNevmToSysStateMachine = async (
  transfer: ITransfer,
  web3: Web3,
  syscoinInstance: syscoin,
  utxo: Partial<UTXOInfo>,
  sendUtxoTransaction: SendUtxoTransaction,
  dispatch: Dispatch<TransferActions>
) => {
  const erc20Manager = new web3.eth.Contract(
    SyscoinERC20ManagerABI,
    "0xA738a563F9ecb55e0b2245D1e9E380f0fE455ea1"
  );
  switch (transfer.status) {
    case "freeze-burn-sys": {
      return freezeAndBurn(erc20Manager, transfer, dispatch);
    }
    case "confirm-freeze-burn-sys": {
      return confirmFreezeAndBurnSys(transfer, web3, dispatch);
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
    case "burn-sysx": {
      return burnSysxToSys(
        transfer,
        utxo,
        syscoinInstance,
        dispatch,
        sendUtxoTransaction
      );
    }

    default:
      return;
  }
};

export default runWithNevmToSysStateMachine;
