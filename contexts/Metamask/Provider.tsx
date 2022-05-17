import { createContext, useContext, useEffect, useState } from "react";
import { TransactionConfig } from "web3-core";

declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      request: (params: { method: string; params?: any }) => Promise<string>;
      isConnected: boolean;
      selectedAddress: string;
    };
  }
}

interface MetamaskContext {
  isEnabled: boolean;
  account?: string;
  requestAccounts: () => void;
  sendTransaction: (transactionConfig: TransactionConfig) => Promise<string>;
}

const MetamaskContext = createContext({} as MetamaskContext);

export const useMetamask = () => useContext(MetamaskContext);

const MetamaskProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [account, setAccount] = useState<string | undefined>();

  const requestAccounts = () => {
    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts) => setAccount(accounts[0]));
  };

  const sendTransaction = (config: TransactionConfig) => {
    return window.ethereum.request({
      method: "eth_sendTransaction",
      params: [config],
    });
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask) {
      setIsEnabled(true);
    }
    if (window.ethereum.selectedAddress) {
      setAccount(window.ethereum.selectedAddress);
    }
  }, []);

  return (
    <MetamaskContext.Provider
      value={{ isEnabled, account, requestAccounts, sendTransaction }}
    >
      {children}
    </MetamaskContext.Provider>
  );
};

export default MetamaskProvider;
