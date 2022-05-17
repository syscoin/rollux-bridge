import { createContext, ReactNode, useState } from "react";
import { useMetamask } from "../Metamask/Provider";
import { usePaliWallet } from "../PaliWallet/usePaliWallet";
import { UTXOInfo, NEVMInfo, UTXOWallet, NEVMWallet } from "./types";

interface IConnectedWalletContext {
  utxo: Partial<UTXOInfo>;
  nevm: Partial<NEVMInfo>;
  connectUTXO: (type: UTXOWallet) => void;
  connectNEVM: (type: NEVMWallet) => void;
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

  return (
    <ConnectedWalletContext.Provider
      value={{
        nevm: {
          type: nevmWalletType,
          account: nevmAccount,
        },
        utxo: {
          type: utxoWalletType,
          account: utxoAccount,
        },
        connectNEVM,
        connectUTXO,
      }}
    >
      {children}
    </ConnectedWalletContext.Provider>
  );
};

export default ConnectedWalletProvider;
