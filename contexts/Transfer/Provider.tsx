import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import reducer from "./store/reducer";
import { ITransfer, TransferStatus, TransferType } from "./types";

import { syscoin, utils as syscoinUtils } from "syscoinjs-lib";
import { BlockbookAPIURL } from "./constants";
import { useConnectedWallet } from "../ConnectedWallet/useConnectedWallet";
import { addLog, initialize, setStatus } from "./store/actions";
import relayAbi from "./relay-abi";
import Web3 from "web3";
import runWithSysToNevmStateMachine from "./functions/sysToNevm";
import runWithNevmToSysStateMachine from "./functions/nevmToSys";

interface ITransferContext {
  transfer: ITransfer;
  maxAmount: number | string | undefined;
  startTransfer: (amount: number) => void;
  setTransferType: (type: TransferType) => void;
  retry: () => void;
  error?: any;
}

export const TransferContext = createContext({} as ITransferContext);

type TransferProviderProps = {
  id: string;
  children: React.ReactNode;
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

  const web3 = useMemo(() => new Web3(Web3.givenProvider), []);

  const relayContract = useMemo(() => {
    return new web3.eth.Contract(
      relayAbi,
      "0xD822557aC2F2b77A1988617308e4A29A89Cb95A6"
    );
  }, [web3]);
  const { utxo, nevm, sendUtxoTransaction } = useConnectedWallet();
  const baseTransfer: Partial<ITransfer> = useMemo(() => {
    return {
      amount: "0",
      id,
      type: "sys-to-nevm",
      status: "initialize",
      logs: [],
      createdAt: Date.now(),
    };
  }, [id]);

  const [transfer, dispatch] = useReducer<typeof reducer>(reducer, {
    ...baseTransfer,
    nevmAddress: nevm.account!,
    utxoAddress: utxo.account!,
    id,
  } as ITransfer);

  const [initialized, setIsInitialized] = useState(false);
  const [previousStatus, setPreviousStatus] = useState<TransferStatus>();
  const [error, setError] = useState();

  const startTransfer = (amount: number) => {
    updateAmount(`${amount}`);
    dispatch(setStatus("initialize"));
    dispatch(
      addLog("initialize", "Starting Sys to NEVM transfer", {
        amount: transfer.amount,
        type: transfer.type,
        utxoAddress: utxo.account,
        nevmAddress: nevm.account,
      })
    );

    if (transfer.type === "sys-to-nevm") {
      dispatch(setStatus("burn-sys"));
    } else if (transfer.type === "nevm-to-sys") {
      dispatch(setStatus("freeze-burn-sys"));
    }
  };

  const updateAmount = (amount: string) => {
    dispatch({
      type: "set-amount",
      payload: amount,
    });
  };

  const setTransferType = (type: TransferType) => {
    dispatch({
      type: "set-type",
      payload: type,
    });
  };

  const runSideEffects = useCallback(() => {
    if (transfer.type === "sys-to-nevm") {
      runWithSysToNevmStateMachine(
        transfer,
        syscoinInstance,
        web3,
        utxo,
        dispatch,
        sendUtxoTransaction,
        nevm,
        relayContract
      ).catch((err) => {
        setError(error);
      });
    } else if (transfer.type === "nevm-to-sys") {
      runWithNevmToSysStateMachine(
        transfer,
        web3,
        syscoinInstance,
        utxo,
        sendUtxoTransaction,
        dispatch
      ).catch((err) => {
        setError(error);
      });
    } else {
      throw new Error("Unknown transfer type");
    }
  }, [
    transfer,
    syscoinInstance,
    web3,
    utxo,
    dispatch,
    sendUtxoTransaction,
    nevm,
    relayContract,
    error,
  ]);

  useEffect(() => {
    if (previousStatus === transfer.status) {
      return;
    }
    setError(undefined);
    runSideEffects();
    setPreviousStatus(transfer.status);
  }, [
    transfer,
    sendUtxoTransaction,
    utxo,
    nevm,
    syscoinInstance,
    relayContract,
    web3,
    previousStatus,
    error,
    runSideEffects,
  ]);

  let maxAmount = undefined;

  if (transfer.type === "sys-to-nevm") {
    maxAmount = utxo.balance;
  } else if (transfer.type === "nevm-to-sys") {
    maxAmount = nevm.balance;
  }

  useEffect(() => {
    if (!initialized || !transfer.id) {
      return;
    }
    if (transfer.status !== "initialize") {
      localStorage.setItem(`transfer-${transfer.id}`, JSON.stringify(transfer));
      fetch(`/api/transfer/${transfer.id}`, {
        body: JSON.stringify(transfer),
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
      }).catch((e) => {
        console.error("Saved in DB Error", e);
      });
    }
  }, [transfer, initialized]);

  useEffect(() => {
    fetch(`/api/transfer/${id}`)
      .then((transfer) => {
        return transfer.status === 200 ? transfer.json() : undefined;
      })
      .then((state) => {
        if (state) {
          dispatch(initialize(state));
        }
      });
    const item = localStorage.getItem(`transfer-${id}`);
    const defaultState = {
      ...baseTransfer,
      nevmAddress: nevm.account!,
      utxoAddress: utxo.account!,
      id,
    } as ITransfer;
    dispatch(initialize(item ? JSON.parse(item) : defaultState));
    setIsInitialized(true);
  }, [id, baseTransfer, nevm, utxo]);

  return (
    <TransferContext.Provider
      value={{
        transfer,
        startTransfer,
        setTransferType,
        retry: () => runSideEffects(),
        error,
        maxAmount,
      }}
    >
      {children}
    </TransferContext.Provider>
  );
};

export default TransferProvider;
