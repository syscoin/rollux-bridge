import React, { createContext, useEffect, useState } from "react";

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
}

declare global {
  interface Window {
    SyscoinWallet?: string;
    ConnectionsController?: ConnectionsController;
  }
}

interface SyscoinEvent {
  detail: {
    SyscoinInstalled: boolean;
    ConnectionsController: boolean;
  };
}

interface SyscoinEvent extends WindowEventMap {
  SyscoinStatus: Event;
}

interface IPaliWalletContext {
  isInstalled: boolean;
  connectedAccount?: string;
  xpubAddress?: string;
  connectWallet: () => void;
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

  return (
    <PaliWalletContext.Provider
      value={{ isInstalled, connectedAccount, connectWallet, xpubAddress }}
    >
      {children}
    </PaliWalletContext.Provider>
  );
};

export default PaliWalletContextProvider;
