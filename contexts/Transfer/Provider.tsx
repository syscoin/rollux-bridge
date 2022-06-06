import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import reducer from "./store/reducer";
import { ITransfer, ITransferLog, TransferStatus, TransferType } from "./types";

import { SPVProof, syscoin, utils as syscoinUtils } from "syscoinjs-lib";
import { BlockbookAPIURL, SYSX_ASSET_GUID } from "./constants";
import { useConnectedWallet } from "../ConnectedWallet/useConnectedWallet";
import { addLog, initialize, setStatus } from "./store/actions";
import burnSysx from "./functions/burnSysx";
import burnSysToSysx from "./functions/burnSysToSysx";
import relayAbi from "./relay-abi";
import Web3 from "web3";
import { getProof } from "bitcoin-proof";

interface ITransferContext {
  transfer: ITransfer;
  startTransfer: (amount: number, type: TransferType) => void;
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
  const initialState: ITransfer = useMemo(
    () => ({
      amount: "0",
      id,
      type: "sys-to-nevm",
      status: "initialize",
      logs: [],
      createdAt: Date.now(),
      nevmAddress: nevm.account!,
      utxoAddress: utxo.account!,
    }),
    [id, utxo, nevm]
  );
  const [transfer, dispatch] = useReducer<typeof reducer>(reducer, {
    ...initialState,
    id,
  });

  const [initialized, setIsInitialized] = useState(false);
  const [previousStatus, setPreviousStatus] = useState<TransferStatus>();
  const [error, setError] = useState();

  const startTransfer = (amount: number, transferType: TransferType) => {
    updateAmount(`${amount}`);
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

  const runSideEffects = useCallback(async () => {
    switch (transfer.status) {
      case "burn-sys": {
        const burnSysTransaction = await burnSysToSysx(
          syscoinInstance,
          parseFloat(transfer.amount).toFixed(6),
          utxo.xpub!,
          utxo.account!
        );
        const burnSysTransactionReceipt = await sendUtxoTransaction(
          burnSysTransaction
        );
        dispatch(
          addLog("burn-sys", "Burning SYS to SYSX", burnSysTransactionReceipt)
        );
        setTimeout(() => dispatch(setStatus("burn-sysx")), 3000);
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
          })
          .once("confirmation", (confirmationNumber: number, receipt: any) => {
            dispatch(
              addLog("completed", "Proof confirmed", {
                confirmationNumber,
                receipt,
              })
            );
            dispatch(setStatus("completed"));
          })
          .on("error", (error: { message: string }) => {
            if (/might still be mined/.test(error.message)) {
              dispatch(setStatus("completed"));
            } else {
              dispatch(
                addLog("error", "Proof error", {
                  error,
                })
              );
              dispatch(setStatus("error"));
            }
          });
        break;
      }
      default:
        return;
    }
  }, [
    transfer,
    sendUtxoTransaction,
    utxo,
    nevm,
    syscoinInstance,
    relayContract,
    web3,
  ]);

  const updateAmount = (amount: string) => {
    dispatch({
      type: "set-amount",
      payload: amount,
    });
  };

  useEffect(() => {
    if (previousStatus === transfer.status) {
      return;
    }
    setError(undefined);
    runSideEffects().catch((err) => {
      setError(error);
    });
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
    runSideEffects,
    error,
  ]);

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
    let defaultState = {
      ...initialState,
      id,
    };
    if (item) {
      defaultState = JSON.parse(item);
    }
    dispatch(initialize(defaultState));
    setIsInitialized(true);
  }, [id, initialState]);

  return (
    <TransferContext.Provider
      value={{
        transfer,
        startTransfer,
        retry: () =>
          runSideEffects().catch((err) => {
            setError(err);
          }),
        error,
      }}
    >
      {children}
    </TransferContext.Provider>
  );
};

export default TransferProvider;
