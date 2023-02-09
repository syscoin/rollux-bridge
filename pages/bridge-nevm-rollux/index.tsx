import React, { FC, useContext, useEffect, useState } from "react";
import { NextPage } from "next";
import { Box, Grid, Container, Card, CardContent, Typography, ButtonBase, Button } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { DepositPart } from "./_deposit";
import { useMetamask } from "@contexts/Metamask/Provider";
import { useConnectedWallet } from "@contexts/ConnectedWallet/useConnectedWallet";
import { ConnectWalletBox } from "./_connectWallet";
import { Web3Ethers, useEthers } from "@usedapp/core";
import { CrossChainMessenger, ETHBridgeAdapter } from "@eth-optimism/sdk";
import { BigNumber, ethers } from "ethers";

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
    const { account, activateBrowserWallet, library } = useEthers();

    const contractsTmp = {
        l1: {
            AddressManager: '0x1FA6902C9734D55869bf868e30244B6E10eC0DCC',
            L1CrossDomainMessenger: '0x2C3026b9845264011FdF709Af0e8df0E6ec09F38',
            L1StandardBridge: '0x77Cdc3891C91729dc9fdea7000ef78ea331cb34A',
            StateCommitmentChain: ethers.constants.AddressZero,
            CanonicalTransactionChain: ethers.constants.AddressZero,
            BondManager: ethers.constants.AddressZero,
            OptimismPortal: '0x6aa4fEb8078661d0fce3E41C0D783f369B42Ae06',
            L2OutputOracle: '0xc61c9628ff50E0CC23000Ec851CcB4BBe42228FE',
        },
        l2: {
            L2ToL1MessagePasser: '0x4200000000000000000000000000000000000016',
            DeployerWhitelist: '0x4200000000000000000000000000000000000002',
            L2CrossDomainMessenger: '0x4200000000000000000000000000000000000007',
            GasPriceOracle: '0x420000000000000000000000000000000000000F',
            L2StandardBridge: '0x4200000000000000000000000000000000000010',
            SequencerFeeVault: '0x4200000000000000000000000000000000000011',
            OptimismMintableERC20Factory: '0x4200000000000000000000000000000000000012',
            L1BlockNumber: '0x4200000000000000000000000000000000000013',
            L1Block: '0x4200000000000000000000000000000000000015',
            LegacyERC20ETH: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
            WETH9: '0x4200000000000000000000000000000000000006',
            GovernanceToken: '0x4200000000000000000000000000000000000042',
            LegacyMessagePasser: '0x4200000000000000000000000000000000000000',
            L2ERC721Bridge: '0x4200000000000000000000000000000000000014',
            OptimismMintableERC721Factory: '0x4200000000000000000000000000000000000017',
            ProxyAdmin: '0x4200000000000000000000000000000000000018',
            BaseFeeVault: '0x4200000000000000000000000000000000000019',
            L1FeeVault: '0x420000000000000000000000000000000000001a',
        },
    }


    const handleDeposit = async () => {

        if (!library) {
            return;
        }

        const w3Provider = library as ethers.providers.JsonRpcProvider;

        const _networkL1 = w3Provider.getSigner();

        const messenger: CrossChainMessenger = new CrossChainMessenger({
            l1SignerOrProvider: _networkL1,
            l2SignerOrProvider: new ethers.providers.JsonRpcProvider('https://bedrock.rollux.com:9545/'),
            l1ChainId: await _networkL1.getChainId(),
            l2ChainId: 57000,
            bedrock: false,
            contracts: contractsTmp,
            bridges: {
                ETH: {
                    Adapter: ETHBridgeAdapter,
                    l1Bridge: contractsTmp.l1.L1StandardBridge,
                    l2Bridge: contractsTmp.l2.L2StandardBridge
                }
            }
        })



        console.log("Bridges");
        console.log(messenger.bridges);

        const depositTx = await messenger.depositETH(ethers.utils.parseEther("0.001"))
        const receiptDepositTx = await messenger.waitForMessageReceipt(depositTx);

        console.log(receiptDepositTx, depositTx);
    }

    const switchAction = (action: CurrentDisplayView) => {
        setCurrentDisplay(action);
    }

    /**!SECTION
     * 
     * Hack for use useDapp
     * 
     * todo : refactor whole app to useDapp instead of web3-react
     */
    useEffect(() => {
        console.log(account);
        if (!account) {
            activateBrowserWallet()

            console.log(account);
        }
    }, [account, activateBrowserWallet]);

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

            {isConnected && <>
                {currentDisplay === CurrentDisplayView.deposit && <DepositPart />}


            </>}

            {!isConnected && <>
                <ConnectWalletBox />
            </>}


            <Button onClick={() => handleDeposit()}>Deposit test</Button>

        </Box>
    )
}

export default BridgeNevmRollux;