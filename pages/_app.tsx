import { ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import { ThemeProvider } from "@mui/material";
import { Config, DAppProvider } from "@usedapp/core";
import { RolluxChain, TanenbaumChain } from "blockchain/NevmRolluxBridge/config/chainsUseDapp";
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

const queryClient = new QueryClient();




const dappConfig: Config = {
  readOnlyChainId: 5700,
  readOnlyUrls: {
    [5700]: 'https://rpc.tanenbaum.io',
    [57000]: 'https://rpc-bedrock.rollux.com/',
  },
  multicallAddresses: {
    [5700]: '0x1F359C32b5D8c9678b076eAac411A4d2Eb11E697', // multicall 2 address.
    [57000]: '0x1F359C32b5D8c9678b076eAac411A4d2Eb11E697'
  },
  networks: [RolluxChain, TanenbaumChain]
}

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin']
})

const chakraTheme = extendTheme({
  fonts: {
    body: roboto.style.fontFamily,
    heading: roboto.style.fontFamily,
  },
  styles: {
    global: {
      'html': {
        height: '100%'
      },
      'body': {
        minHeight: '100%',
      }
    }
  }
})

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()

  if (pathname === '/bridge-nevm-rollux')
    return (
      <QueryClientProvider client={queryClient}>
        <PaliWalletContextProvider>
          <MetamaskProvider>
            <ConnectedWalletProvider>
              <ChakraProvider theme={chakraTheme}>
                <DAppProvider config={dappConfig}>
                  <RolluxHeader />
                  <Component {...pageProps} />
                </DAppProvider>
              </ChakraProvider>
            </ConnectedWalletProvider>
          </MetamaskProvider>
        </PaliWalletContextProvider>
      </QueryClientProvider>
    )

  return (
    <QueryClientProvider client={queryClient}>
      <PaliWalletContextProvider>
        <MetamaskProvider>
          <ConnectedWalletProvider>
            <DAppProvider config={dappConfig}>
              <NetworkValidator>
                <ThemeProvider theme={theme}>
                  <Header />
                </ThemeProvider>
                <Component {...pageProps} />
              </NetworkValidator>
            </DAppProvider>
          </ConnectedWalletProvider>
        </MetamaskProvider>
      </PaliWalletContextProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
