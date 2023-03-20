import React, { FC } from "react"
import { NextPage } from "next";
import { ChakraProvider } from "@chakra-ui/react";
import { chakraTheme } from "components/chakraTheme"
import Head from "next/head";
import { RolluxHeader } from "components/RolluxHeader";
import useWithdrawals from "hooks/rolluxBridge/useWithdrawals";
import { useEthers } from "@usedapp/core";


export const WithdrawalsIndex: NextPage<{}> = ({ }) => {

    const { account } = useEthers();
    const { withdrawals } = useWithdrawals(account);

    return (
        <ChakraProvider theme={chakraTheme}>
            <Head>
                <title>Syscoin Bridge | Rollux & NEVM | Withdrawals</title>
                <link rel="shortcut icon" href="/favicon.ico" />
                <meta name="description" content="Syscoin Trustless Bridge" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <RolluxHeader />

            {JSON.stringify(withdrawals)}

        </ChakraProvider>
    )
}

export default WithdrawalsIndex;