import React, { createContext, useCallback, useEffect, useState } from "react";
import { UTXOTransaction } from "syscoinjs-lib";
import { utils as syscoinUtils } from "syscoinjs-lib";
import { PaliWallet } from "./types";

interface ConnectionsController {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  getConnectedAccount: () => Promise<PaliWallet.Account>;
  onWalletUpdate: (fn: () => Promise<any>) => Promise<any>;
  getConnectedAccountXpub: () => Promise<string>;
  signAndSend: (psbt: UTXOTransaction) => Promise<UTXOTransaction>;
  signPSBT: (psbt: UTXOTransaction) => Promise<UTXOTransaction>;
  getWalletState: () => Promise<PaliWallet.WalletState>;
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
}

export const PaliWalletContext = createContext({} as IPaliWalletContext);

const PaliWalletContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [controller, setController] = useState<ConnectionsController>();
  const [isInstalled, setIsInstalled] = useState<boolean>();
  const [connectedAccount, setConnectedAccount] = useState<string>();
  const [xpubAddress, setXpubAddress] = useState<string>();
  const [walletState, setWalletState] = useState<PaliWallet.WalletState>();

  const sendTransaction = async (transaction: UTXOTransaction) => {
    const windowController = loadWindowController();
    if (!windowController) {
      return Promise.reject("No controller");
    }
    const account = await windowController.getConnectedAccount();
    if (account === null) {
      await connectWallet();
    }
    const signedTransaction = await windowController.signAndSend(transaction);
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
    windowController.onWalletUpdate(async () => {
      const xpubAddress = await windowController.getConnectedAccountXpub();
      const account = await windowController.getConnectedAccount();
      const walletState = await windowController.getWalletState();
      setConnectedAccount(account ? account.address.main : undefined);
      setXpubAddress(xpubAddress);
      setWalletState(walletState);
    });
    return windowController;
  }, [controller]);

  const connectWallet = () => {
    const windowController = loadWindowController();
    if (!windowController) {
      return;
    }
    return windowController.connectWallet();
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
        balance: walletState?.accounts.find(
          (account) => account.address.main === connectedAccount
        )?.balance,
      }}
    >
      {children}
    </PaliWalletContext.Provider>
  );
};

export default PaliWalletContextProvider;
