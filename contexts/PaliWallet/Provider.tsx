import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery } from "react-query";
import { UTXOTransaction } from "syscoinjs-lib";
import { utils as syscoinUtils } from "syscoinjs-lib";
import { PaliWallet } from "./types";

const tenMinutes = 10 * 60 * 1000;

interface ConnectionsController {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  getConnectedAccount: () => Promise<PaliWallet.Account>;
  onWalletUpdate: (fn: () => Promise<any>) => Promise<any>;
  getConnectedAccountXpub: () => Promise<string>;
  signAndSend: (psbt: UTXOTransaction) => Promise<UTXOTransaction>;
  signPSBT: (psbt: UTXOTransaction) => Promise<UTXOTransaction>;
  getWalletState: () => Promise<PaliWallet.WalletState>;
  isLocked: () => Promise<boolean>;
}

declare global {
  interface Window {
    SyscoinWallet?: string;
    ConnectionsController?: ConnectionsController;
  }
}

interface IPaliWalletContext {
  isInstalled?: boolean;
  connectedAccount?: string;
  xpubAddress?: string;
  connectWallet: () => void;
  balance: number | undefined;
  sendTransaction: (
    transaction: UTXOTransaction
  ) => Promise<{ tx: string; error?: any }>;
  confirmTransaction: (
    transaction: { account: string; id: string },
    duration?: number
  ) => Promise<boolean>;
  isTestnet: boolean;
}

export const PaliWalletContext = createContext({} as IPaliWalletContext);

const PaliWalletContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [controller, setController] = useState<ConnectionsController>();
  const [isInstalled, setIsInstalled] = useState<boolean>();
  const [xpubAddress, setXpubAddress] = useState<string>();
  const [walletState, setWalletState] = useState<PaliWallet.WalletState>();
  const [isOnWalletUpdateSet, setIsOnWalletUpdateSet] = useState(false);
  const connectedAccount = useMemo(() => {
    if (!walletState || !xpubAddress) {
      return undefined;
    }
    return walletState.accounts.find((account) => account.xpub === xpubAddress)
      ?.address.main;
  }, [walletState, xpubAddress]);
  const balance = useMemo(() => {
    if (!walletState || !xpubAddress) {
      return undefined;
    }
    return (
      walletState.accounts.find((account) => account.xpub === xpubAddress)
        ?.balance ?? 0
    );
  }, [walletState, xpubAddress]);

  const sendTransaction = async (transaction: UTXOTransaction) => {
    const windowController = loadWindowController();
    if (!windowController) {
      return Promise.reject("No controller");
    }
    const isLocked = await windowController.isLocked();
    if (isLocked) {
      connectWallet();
      await new Promise((resolve, reject) => {
        let retryCount = 10;
        const interval = setInterval(async () => {
          if (retryCount-- <= 0) {
            clearInterval(interval);
            reject("Failed to connect");
          }
          const isLocked = await windowController.isLocked();
          if (!isLocked) {
            clearInterval(interval);
            resolve(true);
          }
        }, 1000);
      });
    }
    if (!connectedAccount) {
      const account = await windowController.getConnectedAccount();
      if (account === null) {
        console.log("Wallet not found");
        await connectWallet();
      }
    }
    console.log("Sending transaction", transaction, new Date());
    const signedTransaction = await windowController
      .signAndSend(transaction)
      .catch((sendTransactionError) => {
        console.error("PaliWallet Sendtransaction", { sendTransactionError });
        return Promise.reject(sendTransactionError);
      });
    console.log("Confirmed transaction", signedTransaction, new Date());
    const unserializedResp = syscoinUtils.importPsbtFromJson(
      signedTransaction,
      syscoinUtils.syscoinNetworks.mainnet
    );
    return {
      tx: unserializedResp.psbt.extractTransaction().getId(),
      error: null,
    };
  };

  const loadWindowController = useCallback(() => {
    if (controller) {
      return controller;
    }
    console.log("controller is set");
    const windowController = window.ConnectionsController!;
    setController(controller);
    if (!isOnWalletUpdateSet) {
      windowController.onWalletUpdate(async () => {
        const xpubAddress = await windowController.getConnectedAccountXpub();
        const walletState = await windowController.getWalletState();
        setXpubAddress(xpubAddress);
        setWalletState(walletState);
      });
      setIsOnWalletUpdateSet(true);
    }
    return windowController;
  }, [controller, setController, isOnWalletUpdateSet, setIsOnWalletUpdateSet]);

  const connectWallet = () => {
    const windowController = loadWindowController();
    if (!windowController) {
      return;
    }
    return windowController.connectWallet();
  };

  const confirmTransaction = (
    transactionDetails: {
      account: string;
      id: string;
    },
    durationInSeconds = tenMinutes
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const expiry = Date.now() + durationInSeconds;
      console.log("Confirming transaction", transactionDetails, expiry);
      const interval = setInterval(async () => {
        const controller = loadWindowController();
        const walletState = await controller.getWalletState().catch((error) => {
          reject(new Error("Error getting wallet state", { cause: error }));
        });
        if (!walletState) {
          clearInterval(interval);
          return;
        }
        const accountInWallet = walletState.accounts.find(
          (account) => account.address.main === transactionDetails.account
        );
        if (!accountInWallet) {
          clearInterval(interval);
          reject(new Error("Account not found in wallet"));
          return;
        }
        const foundWalletTransaction = accountInWallet.transactions.find(
          (walletTransaction) =>
            walletTransaction.txid === transactionDetails.id
        );
        if (!foundWalletTransaction) {
          clearInterval(interval);
          reject(new Error("Transaction not found in wallet"));
          return;
        }
        console.log(
          "Transaction Confirmation check",
          transactionDetails,
          new Date()
        );
        if (foundWalletTransaction.confirmations > 0) {
          console.log("Transaction confirmed", foundWalletTransaction);
          clearInterval(interval);
          resolve(true);
        }

        if (Date.now() > expiry) {
          clearInterval(interval);
          console.log("Transaction not confirmed", foundWalletTransaction);
          resolve(false);
        }
      }, 1000);
    });
  };

  useEffect(() => {
    if (controller) {
      return;
    }

    const callback = async (event: any) => {
      if (event.detail.SyscoinInstalled) {
        setIsInstalled(true);
        console.log("syscoin is installed");

        if (
          event.detail.ConnectionsController &&
          window.ConnectionsController
        ) {
          loadWindowController();
          return;
        }
        return;
      }

      window.removeEventListener("SyscoinStatus", callback);
    };

    console.log("checking syscoin status");

    window.addEventListener("SyscoinStatus", callback);

    const check = setInterval(async () => {
      if (window.ConnectionsController) {
        setIsInstalled(true);
        console.log("syscoin is installed");
        loadWindowController();
        clearInterval(check);
      }
    }, 100);

    setTimeout(() => {
      if (!window.ConnectionsController) {
        setIsInstalled(false);
      }
      clearInterval(check);
    }, 10000);
  }, [controller, loadWindowController]);

  return (
    <PaliWalletContext.Provider
      value={{
        isInstalled,
        connectedAccount,
        connectWallet,
        xpubAddress,
        sendTransaction,
        balance,
        confirmTransaction,
        isTestnet: walletState?.activeNetwork !== "main",
      }}
    >
      {children}
    </PaliWalletContext.Provider>
  );
};

export default PaliWalletContextProvider;
