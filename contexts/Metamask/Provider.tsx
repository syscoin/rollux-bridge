import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { TransactionConfig, provider } from "web3-core";
import Web3 from "web3";
import { NEVMNetwork } from "../Transfer/constants";
import { useQuery } from "react-query";

declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      request: (params: { method: string; params?: any }) => Promise<any>;
      isConnected: boolean;
      selectedAddress: string;
      on: (event: string, callback: (...args: any[]) => void) => void;
      networkVersion: string;
    } & provider;
  }
}

interface IMetamaskContext {
  isEnabled: boolean;
  account?: string;
  balance?: string;
  requestAccounts: () => void;
  sendTransaction: (transactionConfig: TransactionConfig) => Promise<string>;
  fetchBalance: () => void;
  isTestnet: boolean;
  switchToMainnet: () => void;
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
  const { data: isTestnet } = useQuery(
    ["metamask", "isTestnet"],
    () => window?.ethereum?.networkVersion !== parseInt("0x39", 16).toString(),
    {
      enabled: isEnabled,
      refetchInterval: 1000,
    }
  );

  const handleAccounstChange = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    }
  };

  const fetchBalance = useCallback(() => {
    if (!web3 || !account) {
      return;
    }
    web3.eth.getBalance(account).then((balance) => {
      setBalance(web3.utils.fromWei(balance || "0", "ether"));
    });
  }, [web3, account]);

  const requestAccounts = () => {
    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts) => handleAccounstChange(accounts as string[]));
    window.ethereum.on("accountsChanged", handleAccounstChange);
  };

  const sendTransaction = (config: TransactionConfig) => {
    return window.ethereum.request({
      method: "eth_sendTransaction",
      params: [config],
    });
  };

  const switchToMainnet = () => {
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
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask) {
      setIsEnabled(true);
      setWeb3(new Web3(window.ethereum));
      //LINK - switchToMainnet();
    }
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }
    if (window.ethereum.selectedAddress) {
      setAccount(window.ethereum.selectedAddress);
    }
  }, [isEnabled]);

  useEffect(() => {
    fetchBalance();
  }, [account, fetchBalance]);

  return (
    <MetamaskContext.Provider
      value={{
        isEnabled,
        account,
        requestAccounts,
        sendTransaction,
        balance,
        fetchBalance,
        isTestnet: !!isTestnet,
        switchToMainnet,
      }}
    >
      {children}
    </MetamaskContext.Provider>
  );
};

export default MetamaskProvider;
