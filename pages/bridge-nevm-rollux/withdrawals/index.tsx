import React, { FC, useEffect, useState } from "react"
import { NextPage } from "next";
import { Badge, Box, ChakraProvider, Highlight, Flex, Container, Heading, Link } from "@chakra-ui/react";
import { chakraTheme } from "components/chakraTheme"
import Head from "next/head";
import { RolluxHeader } from "components/RolluxHeader";
import useWithdrawals from "hooks/rolluxBridge/useWithdrawals";
import { useEthers } from "@usedapp/core";
import { useSelectedNetwork } from "hooks/rolluxBridge/useSelectedNetwork";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
} from '@chakra-ui/react'
import { MessageStatus } from "@eth-optimism/sdk";
import HistoryRow from "components/BridgeL1L2/HistoryRow";
import { DetailedEventRecord } from "@usedapp/core/dist/esm/src/model";
import { ethers } from "ethers";


export const WithdrawalsIndex: NextPage<{}> = ({ }) => {

    const { account } = useEthers();
    const { listAll } = useWithdrawals(account);
    const { selectedNetwork } = useSelectedNetwork();

    const [withdrawals, setWithdrawals] = useState<{
        withdrawal: DetailedEventRecord<ethers.Contract, "WithdrawalInitiated">,
        status: MessageStatus | null
    }[]>([]);

    useEffect(() => {
        if (listAll) {
            listAll.then(data => {
                if (data.length) {
                    setWithdrawals(data);
                }
            })
        }
    }, [listAll])

    console.log(selectedNetwork);

    return (
        <ChakraProvider theme={chakraTheme}>
            <Head>
                <title>Syscoin Bridge | Rollux & NEVM | Withdrawals</title>
                <link rel="shortcut icon" href="/favicon.ico" />
                <meta name="description" content="Syscoin Trustless Bridge" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <RolluxHeader />

            <Flex
                id="bg"
                boxSize={{ base: undefined, xl: '100%' }}
                overflow="visible"
                position={{ base: 'initial', xl: 'absolute' }}
                bg="#28282F"
                top="0"
                p={{ base: '16px', xl: '100px' }}
                clipPath={{
                    base: undefined,
                    xl: 'polygon(0% -15%, 100% 120%, 100% 100%, 0% 100%)',
                }}
                pb={{ base: '1vh', xl: '100px' }}
                zIndex={-1}
                w="100%"
            >
            </Flex>

            <Container
                padding={6}
                boxShadow={`2px 3px ${chakraTheme.colors.brand.primary}`}
                borderRadius="12px"
                border={`1px solid ${chakraTheme.colors.brand.primary}`}
                justifyContent="center"
                maxWidth={'990px'}
                marginTop={'10px'}
                backgroundColor={'white'}
            >
                <Box padding={3}
                    boxShadow={`7px 7px ${chakraTheme.colors.brand.primary}`}
                    borderRadius="12px"
                    border={`1px solid ${chakraTheme.colors.brand.primary}`}
                    justifyContent="center"
                >
                    <Heading size={'lg'}>Withdrawals History</Heading>
                </Box>


                <TableContainer mt={4}>
                    <Table variant={'simple'}>
                        <Thead>
                            <Tr>
                                <Th>
                                    Time
                                </Th>
                                <Th>
                                    Type
                                </Th>
                                <Th>
                                    Amount
                                </Th>
                                <Th>
                                    Transaction
                                </Th>
                                <Th>
                                    Status
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {withdrawals?.map((value) => {
                                return (
                                    <HistoryRow
                                        key={value.withdrawal.transactionHash}
                                        amount={"-"}
                                        actionStatus={value.status ?? MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE}
                                        time={new Date}
                                        type={'Withdraw'}
                                        transactionHash={value.withdrawal.transactionHash}
                                        onClickAction={() => { }}
                                    />
                                )
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Container>




        </ChakraProvider>
    )
}

export default WithdrawalsIndex;