import React, { FC } from "react"
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
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'


export const WithdrawalsIndex: NextPage<{}> = ({ }) => {

    const { account } = useEthers();
    const { withdrawals } = useWithdrawals(account);
    const { selectedNetwork } = useSelectedNetwork();

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
                            <Tr>
                                <Td>
                                    17 March 2023 at 22:50 EET
                                </Td>
                                <Td>
                                    Withdraw
                                </Td>
                                <Td>
                                    0.05 SYS
                                </Td>
                                <Td>
                                    <Link href="#" bgColor={'Highlight'}>
                                        0x8c17...b192
                                    </Link>
                                </Td>
                                <Td>
                                    <Badge colorScheme={'green'}>Success</Badge>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td>
                                    17 March 2023 at 22:50 EET
                                </Td>
                                <Td>
                                    Withdraw
                                </Td>
                                <Td>
                                    0.05 SYS
                                </Td>
                                <Td>
                                    <Link href="#" bgColor={'Highlight'}>
                                        0x8c17...b192
                                    </Link>
                                </Td>
                                <Td>
                                    <Badge colorScheme={'green'}>Success</Badge>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td>
                                    17 March 2023 at 22:50 EET
                                </Td>
                                <Td>
                                    Withdraw
                                </Td>
                                <Td>
                                    0.05 SYS
                                </Td>
                                <Td>
                                    <Link href="#" bgColor={'Highlight'}>
                                        0x8c17...b192
                                    </Link>
                                </Td>
                                <Td>
                                    <Badge colorScheme={'green'}>Success</Badge>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td>
                                    17 March 2023 at 22:50 EET
                                </Td>
                                <Td>
                                    Withdraw
                                </Td>
                                <Td>
                                    0.05 SYS
                                </Td>
                                <Td>
                                    <Link href="#" bgColor={'Highlight'}>
                                        0x8c17...b192
                                    </Link>
                                </Td>
                                <Td>
                                    <Badge colorScheme={'green'}>Success</Badge>
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            </Container>




        </ChakraProvider>
    )
}

export default WithdrawalsIndex;