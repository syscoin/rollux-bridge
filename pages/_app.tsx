import { ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import { ThemeProvider } from "@mui/material";
import { Config, DAppProvider, MetamaskConnector, CoinbaseWalletConnector, Mainnet } from "@usedapp/core";
import { NEVMChain, RolluxChain, RolluxChainMainnet, TanenbaumChain } from "blockchain/NevmRolluxBridge/config/chainsUseDapp";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from "components/Common/ErrorFallback";

const queryClient = new QueryClient();

const dappConfig: Config = {
  readOnlyChainId: 5700,
  readOnlyUrls: {
    [5700]: 'https://rpc.tanenbaum.io',
    [57000]: 'https://rpc-tanenbaum.rollux.com/',
    [RolluxChainMainnet.chainId]: RolluxChainMainnet.rpcUrl || '',
    [NEVMChain.chainId]: NEVMChain.rpcUrl || '',
  },
  multicallAddresses: {
    [RolluxChainMainnet.chainId]: '0x65D1f2821d899Fd31f57b1c0FF1179039979e875',
    [NEVMChain.chainId]: '0x0c457A8E4bD35eA571956d6bb7443c5C661d7607',
    [5700]: '0x1F359C32b5D8c9678b076eAac411A4d2Eb11E697', // multicall 2 address.
    [57000]: '0x1F359C32b5D8c9678b076eAac411A4d2Eb11E697',

  },
  networks: [RolluxChain, TanenbaumChain, NEVMChain, RolluxChainMainnet, Mainnet],
  connectors: {
    metamask: new MetamaskConnector(),
    coinBase: new CoinbaseWalletConnector(),
    // walletConnectV2: new WalletConnectV2Connector.WalletConnectV2Connector({
    //   projectId: '6b7e7faf5a9e54e3c5f22289efa5975b',
    //   chains: [RolluxChain, TanenbaumChain, NEVMChain, RolluxChainMainnet],
    //   rpcMap: {
    //     57000: RolluxChain.rpcUrl || '',
    //     5700: TanenbaumChain.rpcUrl || '',
    //     57: NEVMChain.rpcUrl || '',
    //     570: RolluxChainMainnet.rpcUrl || '',
    //   }
    // })
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()

  const removeMuiHeader = [
    '/bridge-nevm-rollux',
    '/bridge-nevm-rollux/withdrawals',
    '/bridge-nevm-rollux/create-token',
    '/bridge-nevm-rollux/nft',
  ]

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DAppProvider config={dappConfig}>
          <Component {...pageProps} />
        </DAppProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default MyApp;
