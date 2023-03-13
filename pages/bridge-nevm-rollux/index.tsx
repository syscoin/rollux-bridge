import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { Box, Grid, Container, Card, CardContent, Typography, ButtonBase, Button, Backdrop, CircularProgress } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { DepositPart } from "./_deposit";
import { WithdrawPart } from "./_withdraw"
import { useMetamask } from "@contexts/Metamask/Provider";
import { useConnectedWallet } from "@contexts/ConnectedWallet/useConnectedWallet";
import { ConnectWalletBox } from "./_connectWallet";
import { useEthers, useLogs, useSigner } from "@usedapp/core";
import { CrossChainMessenger, MessageStatus } from "@eth-optimism/sdk";
import { BigNumber, ethers } from "ethers";
import { networks, getNetworkByChainId, NetworkData, networksMap, getNetworkByName } from "blockchain/NevmRolluxBridge/config/networks";
import { crossChainMessengerFactory } from "blockchain/NevmRolluxBridge/factories/CrossChainMessengerFactory";
import { RolluxChain, TanenbaumChain } from "blockchain/NevmRolluxBridge/config/chainsUseDapp";
import OnGoingTxns from "components/BridgeL1L2/WIthdraw/OnGoingTxns";

type BridgeNevmRolluxProps = {}

enum CurrentDisplayView {
    deposit,
    withdraw
}

export const BridgeNevmRollux: NextPage<BridgeNevmRolluxProps> = ({ }) => {
    const router = useRouter();
    const [currentDisplay, setCurrentDisplay] = useState<CurrentDisplayView>(CurrentDisplayView.deposit);
    const metamask = useMetamask();
    const connectedWalletCtxt = useConnectedWallet();
    const isConnected = connectedWalletCtxt.nevm.account;
    const { account, activateBrowserWallet, library, switchNetwork } = useEthers();
    const [crossChainMessenger, setCrossChainMessenger] = useState<CrossChainMessenger | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getCrossChainMessenger = async (library: any, currentDisplay: CurrentDisplayView) => {
        if (!library) {
            console.warn("No library")
            return undefined;
        }


        const w3Provider = library as ethers.providers.JsonRpcProvider;
        const currentChainId: number = await w3Provider.getSigner().getChainId();

        console.log(currentChainId);

        const network: NetworkData | undefined = getNetworkByChainId(currentChainId, networks);

        if (!network) {
            console.warn("Can not detect network")
            return undefined;
        }

        const netMap = networksMap[network.name] ?? undefined;
        console.log(network.name);

        if (!netMap) {
            console.warn("Cant not find net mapping")

            return undefined;
        }

        const secondNetwork: NetworkData | undefined = getNetworkByName(netMap, networks);

        if (!secondNetwork) {
            console.warn("Failed to fetch second network by name");
            return undefined;
        }

        console.log(network, secondNetwork);

        const l1Contracts = network.layer === 1 ? network : secondNetwork;
        const l2Contracts = secondNetwork.layer === 2 ? secondNetwork : network;


        if (currentDisplay === CurrentDisplayView.deposit) {

            return crossChainMessengerFactory(
                l1Contracts,
                l2Contracts,
                w3Provider.getSigner(),
                new ethers.providers.JsonRpcProvider(secondNetwork?.rpcAddress),
                true
            )

        }

        // withdraw

        return crossChainMessengerFactory(
            l1Contracts,
            l2Contracts,
            new ethers.providers.JsonRpcProvider(TanenbaumChain.rpcUrl),
            w3Provider.getSigner(),
            true
        )


    };

    const handleERC20Approval = async (l1Token: string, l2Token: string, amount: BigNumber) => {
        if (!library) {
            console.warn("approval:no-library")
            return; // not connected wallet
        }

        if (!crossChainMessenger) {
            console.warn("approval:no-messenger")
            return; // no messenger initialized
        }

        try {
            await crossChainMessenger.approveERC20(l1Token, l2Token, amount);

            setIsLoading(false);
        } catch (e) {
            console.log(e);
            setIsLoading(false);
        }
    }

    const handleERC20Deposit = async (l1Token: string, l2Token: string, amount: BigNumber) => {
        if (!library || !crossChainMessenger) {
            return; // not connected or not initialized
        }

        try {
            const tx = await crossChainMessenger.depositERC20(l1Token, l2Token, amount);
            await tx.wait();

            await crossChainMessenger.waitForMessageStatus(tx.hash,
                MessageStatus.RELAYED)

            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
        }

        // if success

    }

    const handleWithdrawMainCurrency = async (amount: string) => {
        if (!library || !crossChainMessenger) {
            console.log('no lib or messenger')
            return;
        }

        try {
            // const withdrawTx = await crossChainMessenger.withdrawETH(
            //     ethers.utils.parseEther(amount)
            // );

            // await withdrawTx.wait();

            const withdrawTx = {
                hash: '0x957e9cfbf261fb404e31c34645986c081b3983890f61a26d9d1ac8b778dc4cc4',
            }

            console.log('waited 1');


            await crossChainMessenger.waitForMessageStatus(withdrawTx.hash,
                MessageStatus.READY_TO_PROVE)

            console.log('status message #1');

            await switchNetwork(5700);

            const messengerL1 = crossChainMessengerFactory(
                networks.L1Dev,
                networks.L2Dev,
                (library as ethers.providers.JsonRpcProvider).getSigner(),
                new ethers.providers.JsonRpcProvider(RolluxChain.rpcUrl),
                true
            );


            const proveTx = await messengerL1.proveMessage(withdrawTx.hash);

            await proveTx.wait();

            console.log(proveTx);

            console.log('wait 2');

            await messengerL1.waitForMessageStatus(withdrawTx.hash,
                MessageStatus.READY_FOR_RELAY)

            console.log('wait3');



            // 1st step = 2h / 2nd step = 25m / 3rd = 5m


            const finalizeTx = await messengerL1.finalizeMessage(withdrawTx.hash);

            await finalizeTx.wait();


        } catch (e) {
            console.log(`Withdraw SYS failed. Error - ${e}`)
        }
    }

    const handleDepositMainCurrency = async (amount: string) => {
        if (!library) {
            return;
        }

        if (crossChainMessenger) {
            try {

                setIsLoading(true);

                const depositTx = await crossChainMessenger.depositETH(
                    ethers.utils.parseEther(amount)
                );

                const confirmation = await crossChainMessenger.waitForMessageReceipt(depositTx);

                if (confirmation.receiptStatus === 1) {
                    console.log('OK')

                    setIsLoading(false);
                } else {
                    console.log('Error');
                    console.log(confirmation);
                    setIsLoading(false);
                }
            } catch (e) {
                setIsLoading(false);
                console.log(e);
            }

        }

    }

    const switchAction = (action: CurrentDisplayView) => {
        setCurrentDisplay(action);
    }

    /**
     * 
     * Hack for use useDapp
     * 
     * todo : refactor whole app to useDapp instead of web3-react
     */
    useEffect(() => {
        if (!account && connectedWalletCtxt.nevm.account) {
            activateBrowserWallet()
        }
    }, [account, activateBrowserWallet, connectedWalletCtxt.nevm.account]);

    useEffect(() => {
        getCrossChainMessenger(library, currentDisplay).then((messenger) => {
            console.log(messenger);
            setCrossChainMessenger(messenger);
        })

        /// load txns for withdrawals which're pending if current display is for withdrawal

        if (currentDisplay === CurrentDisplayView.withdraw) {

        }
    }, [library, currentDisplay])

    // const {logs} = useLogs(
    //     {contract: new ethers.Contract(crossChainMessenger?.contracts.l2.L2StandardBridge, )}
    // )

    return (

        <Box>
            <Head>
                <title>Syscoin Bridge | Rollux & NEVM </title>
                <link rel="shortcut icon" href="/favicon.ico" />
                <meta name="description" content="Syscoin Trustless Bridge" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Box component={Container} sx={{ alignItems: 'center', my: 3 }}>
                <Grid container spacing={2}>
                    <Grid xs={12} item>
                        <Card variant="outlined" sx={{ padding: '10px' }}>
                            <Typography variant="h3">
                                Swap your SYS between NEVM and Rollux.
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <Box component={Container} sx={{ alignItems: 'center', my: 3 }}>
                <Grid container spacing={3}>
                    <Grid xs={6} item alignItems={'center'}>
                        <Card raised={currentDisplay === CurrentDisplayView.deposit} sx={{ width: 1 }}>
                            <ButtonBase onClick={(event) => switchAction(CurrentDisplayView.deposit)} sx={{ width: 1 }}>
                                <CardContent sx={{ alignContent: 'center' }}>
                                    <Typography variant="h5" textAlign={'center'}>
                                        Deposit
                                    </Typography>
                                </CardContent>
                            </ButtonBase>
                        </Card>
                    </Grid>
                    <Grid xs={6} item alignItems={'center'}>
                        <Card raised={currentDisplay === CurrentDisplayView.withdraw} sx={{ width: 1 }}>
                            <ButtonBase onClick={(event) => switchAction(CurrentDisplayView.withdraw)} sx={{ width: 1 }}>
                                <CardContent sx={{ alignContent: 'center' }}>
                                    <Typography variant="h5" textAlign={'center'}>
                                        Withdraw
                                    </Typography>
                                </CardContent>
                            </ButtonBase>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
                onClick={() => {
                    // handle nothing . Wait for tx ends or results.
                }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>


            {isConnected && <>
                {currentDisplay === CurrentDisplayView.deposit && <DepositPart

                    onClickDepositButton={(amount: string, tokenAddress: string | undefined) => {
                        if (!tokenAddress) {
                            handleDepositMainCurrency(amount);
                        }
                    }}
                    onClickApproveERC20={(l1Token: string, l2Token: string, amount: BigNumber) => {
                        handleERC20Approval(l1Token, l2Token, amount);
                    }}

                    onClickDepositERC20={(l1Token: string, l2Token: string, amount: BigNumber) => {
                        handleERC20Deposit(l1Token, l2Token, amount);
                    }}

                    setIsLoading={setIsLoading}

                    L1StandardBridgeAddress="0x77Cdc3891C91729dc9fdea7000ef78ea331cb34A"
                />}

                {currentDisplay === CurrentDisplayView.withdraw && <div>


                    <WithdrawPart
                        onClickWithdrawButton={(amount) => {
                            console.log(amount);
                            handleWithdrawMainCurrency(amount);
                        }}
                        onClickWithdrawERC20={(l1Token, l2Token, amount) => { }}

                        setIsLoading={setIsLoading}

                        L1StandardBridgeAddress="0x77Cdc3891C91729dc9fdea7000ef78ea331cb34A"
                    />

                    <OnGoingTxns txns={[{ hash: '0x', amount: '11', symbol: 'SYS', step: 1 }, { hash: '0x1', amount: '15', symbol: 'SYS', step: 2 }]}
                        onTxnInfoRequested={(hash: string) => {
                            console.log(hash);
                        }}

                    />
                </div>}




            </>}

            {!isConnected && <>
                <ConnectWalletBox />
            </>}

        </Box>
    )
}

export default BridgeNevmRollux;