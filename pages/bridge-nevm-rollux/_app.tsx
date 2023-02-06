import "../styles/globals.css";
import type { AppProps } from "next/app";
import theme from "../../components/theme";
import { ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { Config, DAppProvider } from "@usedapp/core";
import { useEffect } from "react";

const queryClient = new QueryClient();

const dappConfig: Config = {

};

function MyApp({ Component, pageProps }: AppProps) {

    useEffect(() => {
        console.log("New app");
    })

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <DAppProvider config={dappConfig}>
                    <Component {...pageProps} />
                </DAppProvider>
            </ThemeProvider>
        </QueryClientProvider >
    );
}

export default MyApp;
