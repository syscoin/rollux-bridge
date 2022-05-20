import React, { createContext, useEffect, useState } from "react";
import { UTXOTransaction } from "syscoinjs-lib";
import { utils as syscoinUtils } from "syscoinjs-lib";

interface IAccount {
  address: { main: string };
  balance: number;
  assets: [];
  id: number;
  isTrezorWallet: boolean;
  label: string;
  transactions: [];
  xpub: string;
}

interface ConnectionsController {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  getConnectedAccount: () => Promise<IAccount>;
  onWalletUpdate: (fn: () => Promise<any>) => Promise<any>;
  getConnectedAccountXpub: () => Promise<string>;
  signAndSend: (psbt: UTXOTransaction) => Promise<UTXOTransaction>;
  signPSBT: (psbt: UTXOTransaction) => Promise<UTXOTransaction>;
}

declare global {
  interface Window {
    SyscoinWallet?: string;
    ConnectionsController?: ConnectionsController;
  }
}

interface IPaliWalletContext {
  isInstalled: boolean;
  connectedAccount?: string;
  xpubAddress?: string;
  connectWallet: () => void;
  sendTransaction: (
    transaction: UTXOTransaction
  ) => Promise<{ tx: string; error?: any }>;
}

export const PaliWalletContext = createContext({} as IPaliWalletContext);

const PaliWalletContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [controller, setController] = useState<ConnectionsController>();
  const [isInstalled, setIsInstalled] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<string>();
  const [xpubAddress, setXpubAddress] = useState<string>();

  useEffect(() => {
    if (window === undefined) {
      return;
    }
    if (window.ConnectionsController) {
      setIsInstalled(true);
      setController(window.ConnectionsController);
    }

    return () => {
      if (controller) {
        controller.disconnectWallet();
      }
    };
  }, [controller]);

  useEffect(() => {
    if (!controller) {
      return;
    }
    controller.onWalletUpdate(async () => {
      const xpubAddress = await controller.getConnectedAccountXpub();
      const account = await controller.getConnectedAccount();
      setConnectedAccount(account ? account.address.main : undefined);
      setXpubAddress(xpubAddress);
    });
  }, [controller]);

  const connectWallet = () => {
    if (!controller) {
      return;
    }
    controller.connectWallet();
  };

  const sendTransaction = async (transaction: UTXOTransaction) => {
    if (!controller) {
      return Promise.reject("No controller");
    }
    const signedTransaction = await controller.signAndSend(transaction);
    const unserializedResp = syscoinUtils.importPsbtFromJson(
      signedTransaction,
      syscoinUtils.syscoinNetworks.mainnet
    );
    return {
      tx: unserializedResp.psbt.extractTransaction().getId(),
      error: null,
    };
  };

  return (
    <PaliWalletContext.Provider
      value={{
        isInstalled,
        connectedAccount,
        connectWallet,
        xpubAddress,
        sendTransaction,
      }}
    >
      {children}
    </PaliWalletContext.Provider>
  );
};

export default PaliWalletContextProvider;
