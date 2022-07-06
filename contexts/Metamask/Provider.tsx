import { createContext, useContext, useEffect, useState } from "react";
import { TransactionConfig, provider } from "web3-core";
import Web3 from "web3";
import { NEVMNetwork } from "../Transfer/constants";

declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      request: (params: { method: string; params?: any }) => Promise<string>;
      isConnected: boolean;
      selectedAddress: string;
    } & provider;
  }
}

interface IMetamaskContext {
  isEnabled: boolean;
  account?: string;
  balance?: string;
  requestAccounts: () => void;
  sendTransaction: (transactionConfig: TransactionConfig) => Promise<string>;
}

const MetamaskContext = createContext({} as IMetamaskContext);

export const useMetamask = () => useContext(MetamaskContext);

const MetamaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [account, setAccount] = useState<string | undefined>();
  const [web3, setWeb3] = useState<Web3>();
  const [balance, setBalance] = useState<string>();

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
      setWeb3(new Web3(window.ethereum));
    }
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }
    if (window.ethereum.selectedAddress) {
      setAccount(window.ethereum.selectedAddress);
    }
    window.ethereum
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x39" }],
      })
      .catch(({ code }) => {
        if (code === 4902) {
          window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [NEVMNetwork],
          });
        }
      });
  }, [isEnabled]);

  useEffect(() => {
    if (!web3 || !account) {
      return;
    }
    web3.eth.getBalance(account).then((balance) => {
      setBalance(web3.utils.fromWei(balance));
    });
  }, [web3, account, setBalance]);

  return (
    <MetamaskContext.Provider
      value={{ isEnabled, account, requestAccounts, sendTransaction, balance }}
    >
      {children}
    </MetamaskContext.Provider>
  );
};

export default MetamaskProvider;
