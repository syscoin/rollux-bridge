import { createContext, ReactNode, useState } from "react";
import { UTXOTransaction } from "syscoinjs-lib";
import { useMetamask } from "../Metamask/Provider";
import { usePaliWallet } from "../PaliWallet/usePaliWallet";
import { UTXOInfo, NEVMInfo, UTXOWallet, NEVMWallet } from "./types";

export type SendUtxoTransaction = (
  transaction: UTXOTransaction
) => Promise<{ tx: string; error?: any }>;

interface IConnectedWalletContext {
  utxo: Partial<UTXOInfo>;
  nevm: Partial<NEVMInfo>;
  connectUTXO: (type: UTXOWallet) => void;
  connectNEVM: (type: NEVMWallet) => void;
  sendUtxoTransaction: SendUtxoTransaction;
  availableWallets: {
    paliWallet?: boolean;
    metamask: boolean;
  };
}

export const ConnectedWalletContext = createContext(
  {} as IConnectedWalletContext
);

const ConnectedWalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [utxoWalletType, setUtxoWalletType] =
    useState<UTXOWallet>("pali-wallet");
  const [nevmWalletType, setNevmWalletType] = useState<NEVMWallet>("metamask");
  const paliWallet = usePaliWallet();
  const metamask = useMetamask();

  const utxoAccount = paliWallet.connectedAccount;
  const nevmAccount = metamask.account;

  const connectUTXO = (type: UTXOWallet = "pali-wallet") => {
    if (type === "pali-wallet") {
      paliWallet.connectWallet();
    }
    setUtxoWalletType(type);
  };

  const connectNEVM = (type: NEVMWallet) => {
    if (type === "metamask") {
      metamask.requestAccounts();
    }
    setNevmWalletType(type);
  };

  const sendUtxoTransaction: SendUtxoTransaction = (
    transaction: UTXOTransaction
  ) => {
    if (utxoWalletType === "pali-wallet") {
      return paliWallet.sendTransaction(transaction);
    }
    return Promise.reject(new Error("Wallet not connected"));
  };

  return (
    <ConnectedWalletContext.Provider
      value={{
        nevm: {
          type: nevmWalletType,
          account: nevmAccount,
          balance: metamask.balance,
        },
        utxo: {
          type: utxoWalletType,
          account: utxoAccount,
          xpub: paliWallet.xpubAddress,
          balance: paliWallet.balance,
        },
        connectNEVM,
        connectUTXO,
        sendUtxoTransaction,
        availableWallets: {
          paliWallet: paliWallet.isInstalled,
          metamask: metamask.isEnabled,
        },
      }}
    >
      {children}
    </ConnectedWalletContext.Provider>
  );
};

export default ConnectedWalletProvider;
