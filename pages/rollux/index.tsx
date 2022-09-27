import { NextPage } from "next";

const RolluxTestnet: NextPage = () => {
  const addRollux = () => {
    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0xAFE",
          chainName: "Rollux Testnet Syscoin",
          nativeCurrency: {
            name: "Syscoin",
            symbol: "rSYS",
            decimals: 18,
          },
          rpcUrls: ["https://testnet.rollux.com:2814/"],
          blockExplorerUrls: ["https://explorer.testnet.rollux.com/"],
        },
      ],
    });
  };
  return (
    <div>
      Rollux Testnet:
      <button onClick={addRollux}>Add</button>
    </div>
  );
};

export default RolluxTestnet;
