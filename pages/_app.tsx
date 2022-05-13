import "../styles/globals.css";
import type { AppProps } from "next/app";
import PaliWalletContextProvider from "../contexts/PaliWallet/Provider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PaliWalletContextProvider>
      <Component {...pageProps} />
    </PaliWalletContextProvider>
  );
}

export default MyApp;
