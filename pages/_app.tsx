import "../styles/globals.css";
import type { AppProps } from "next/app";
import PaliWalletContextProvider from "../contexts/PaliWallet/Provider";
import MetamaskProvider from "../contexts/Metamask/Provider";
import theme from "../components/theme";
import { ThemeProvider } from "@mui/material";
import ConnectedWalletProvider from "../contexts/ConnectedWallet/Provider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <PaliWalletContextProvider>
        <MetamaskProvider>
          <ConnectedWalletProvider>
            <Component {...pageProps} />
          </ConnectedWalletProvider>
        </MetamaskProvider>
      </PaliWalletContextProvider>
    </ThemeProvider>
  );
}

export default MyApp;
