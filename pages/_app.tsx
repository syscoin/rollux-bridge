import { ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import { ThemeProvider } from "@mui/material";
import { Config, DAppProvider } from "@usedapp/core";
import { NEVMChain, RolluxChain, RolluxChainMainnet, TanenbaumChain } from "blockchain/NevmRolluxBridge/config/chainsUseDapp";
import { NetworkValidator } from "components/Common/NetworkValidator";
import { Header } from "components/Header";
import { RolluxHeader } from "components/RolluxHeader";
import type { AppProps } from "next/app";
import { Roboto } from 'next/font/google';
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import theme from "../components/theme";
import ConnectedWalletProvider from "../contexts/ConnectedWallet/Provider";
import MetamaskProvider from "../contexts/Metamask/Provider";
import PaliWalletContextProvider from "../contexts/PaliWallet/Provider";
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
  networks: [RolluxChain, TanenbaumChain, NEVMChain, RolluxChainMainnet]
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
        <PaliWalletContextProvider>
          <MetamaskProvider>
            <ConnectedWalletProvider>
              <DAppProvider config={dappConfig}>
                <ThemeProvider theme={theme}>
                  {removeMuiHeader.includes(pathname) ? null : <Header />}
                </ThemeProvider>
                <Component {...pageProps} />
              </DAppProvider>
            </ConnectedWalletProvider>
          </MetamaskProvider>
        </PaliWalletContextProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default MyApp;
