import { createContext, useEffect, useMemo, useReducer } from "react";
import reducer from "./store/reducer";
import { ITransfer, ITransferLog, TransferType } from "./types";

import { syscoin, utils as syscoinUtils } from "syscoinjs-lib";
import { BlockbookAPIURL, SYSX_ASSET_GUID } from "./constants";
import { useConnectedWallet } from "../ConnectedWallet/useConnectedWallet";
import { addLog, setStatus } from "./store/actions";
import burnSysx from "./functions/burnSysx";
import burnSysToSysx from "./functions/burnSysToSysx";

interface ITransferContext {
  transfer: ITransfer;
  startTransfer: (type: TransferType) => void;
  updateAmount: (amount: string) => void;
}

export const TransferContext = createContext({} as ITransferContext);

type TransferProviderProps = {
  id: string;
  children: React.ReactNode;
};

const initialState: ITransfer = {
  amount: "0",
  id: "",
  type: "sys-to-nevm",
  status: "initialize",
  logs: [],
};

const TransferProvider: React.FC<TransferProviderProps> = ({
  id,
  children,
}) => {
  const syscoinInstance = useMemo(
    () =>
      new syscoin(null, BlockbookAPIURL, syscoinUtils.syscoinNetworks.mainnet),
    []
  );
  const { utxo, nevm, sendUtxoTransaction } = useConnectedWallet();
  const [transfer, dispatch] = useReducer<typeof reducer>(reducer, {
    ...initialState,
    id,
  });

  const startTransfer = (transferType: TransferType) => {
    if (transferType === "sys-to-nevm") {
      dispatch({
        type: "set-type",
        payload: transferType,
      });
      startSysToNevmTransfer();
    }
  };

  const startSysToNevmTransfer = () => {
    if (utxo.account && nevm.account) {
      dispatch(setStatus("initialize"));
      dispatch(
        addLog("initialize", "Starting Sys to NEVM transfer", {
          amount: transfer.amount,
          type: transfer.type,
          utxoAddress: utxo.account,
          nevmAddress: nevm.account,
        })
      );
      dispatch(setStatus("burn-sys"));
    }
  };

  useEffect(() => {
    const latestLog = transfer.logs.slice(-1)[0];
    console.log({ latestLog });
    const run = async () => {
      switch (transfer.status) {
        case "burn-sys": {
          const burnSysTransaction = await burnSysToSysx(
            syscoinInstance,
            transfer.amount,
            utxo.xpub!,
            utxo.account!
          );
          const burnSysTransactionReceipt = await sendUtxoTransaction(
            burnSysTransaction
          );
          dispatch(
            addLog("burn-sys", "Burning SYS to SYSX", burnSysTransactionReceipt)
          );
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
            nevm.account!
          );
          const burnSysxTransactionReceipt = await sendUtxoTransaction(
            burnSysxTransaction
          );
          dispatch(
            addLog(
              "burn-sysx",
              "Burning SYSX to NEVM",
              burnSysxTransactionReceipt
            )
          );
          dispatch(setStatus("generate-proofs"));
          break;
        }

        case "generate-proofs": {
          const { tx } = transfer.logs.find((log) => log.status === "burn-sysx")
            ?.payload.data;
          const proof = await syscoinUtils.fetchBackendSPVProof(
            BlockbookAPIURL,
            tx
          );
          dispatch(addLog("generate-proofs", "Submitting proofs", { proof }));
          dispatch(setStatus("submit-proofs"));
        }
        default:
          return;
      }
    };
    run()
      .then(() => {
        localStorage.setItem(
          `transfer-${transfer.id}`,
          JSON.stringify(transfer)
        );
        console.log("success");
      })
      .catch((err) => {
        console.log({ err });
      });
  }, [
    transfer,
    transfer.status,
    sendUtxoTransaction,
    utxo,
    nevm,
    syscoinInstance,
  ]);

  const updateAmount = (amount: string) => {
    dispatch({
      type: "set-amount",
      payload: amount,
    });
  };

  return (
    <TransferContext.Provider value={{ transfer, startTransfer, updateAmount }}>
      {children}
    </TransferContext.Provider>
  );
};

export default TransferProvider;
