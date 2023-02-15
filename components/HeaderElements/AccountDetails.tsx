import { Box, Grid, Typography, Button } from "@mui/material";
import { Chain, useEthers } from "@usedapp/core";
import React, { FC, useEffect, useState } from "react";
import { useEtherBalance } from "@usedapp/core";
import { BigNumber, ethers } from "ethers";
import { useConnectedWallet } from "@contexts/ConnectedWallet/useConnectedWallet";
import { RolluxChain, TanenbaumChain } from "blockchain/NevmRolluxBridge/config/chainsUseDapp";

const styleModal = {
    position: 'absolute' as 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    bgcolor: 'background.paper',
    boxShadow: 34,
    p: 4,
};


interface AddEthereumChainParameter {
    chainId: string; // A 0x-prefixed hexadecimal string
    chainName: string;
    nativeCurrency: {
        name: string;
        symbol: string; // 2-6 characters long
        decimals: 18;
    };
    rpcUrls: string[];
    blockExplorerUrls?: string[];
    iconUrls?: string[]; // Currently ignored.
}

export const AccountDetails: FC = () => {
    const { account, library, deactivate, chainId, switchNetwork } = useEthers();
    const balance = useEtherBalance(account);


    const [currentNetwork, setCurrentNetwork] = useState<'L1' | 'L2' | 'N/A'>('L1');


    const addNetwork = async (layer: number = 2) => {
        if (!library) {
            return; // no connected wallet
        }

        const chainToLayerMap: { [key: number]: Chain } = {
            1: TanenbaumChain,
            2: RolluxChain,
        }

        const chainToAdd = chainToLayerMap[layer];


        try {
            await switchNetwork(chainToAdd.chainId);
        } catch (e) {
            const provider = library as ethers.providers.JsonRpcProvider;
            await provider.send('wallet_addEthereumChain', [{
                chainId: ethers.utils.hexValue(chainToAdd.chainId),
                chainName: chainToAdd.chainName,
                nativeCurrency: chainToAdd.nativeCurrency,
                rpcUrls: [chainToAdd.rpcUrl],
                blockExplorerUrls: [chainToAdd.blockExplorerUrl]
            } as AddEthereumChainParameter])
        }
    }


    useEffect(() => {

        let network: 'L1' | 'L2' | 'N/A' = 'N/A';


        if (chainId === RolluxChain.chainId) {
            network = 'L2'
        }

        if (chainId === TanenbaumChain.chainId) {
            network = 'L1'
        }

        setCurrentNetwork(network);

    }, [chainId])




    return (
        <Box sx={styleModal}>
            <Typography variant="h6" component={'h2'}>
                Account Details
            </Typography>

            <Grid container sx={{ mt: 3 }}>
                <Grid item xs={4}>
                    <Typography variant="h6">
                        Address
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography variant="h6">
                        {account}
                    </Typography>
                </Grid>
            </Grid>

            <Grid container sx={{ mt: 3 }}>
                <Grid item xs={4}>
                    <Typography variant="h6">
                        Current network
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography variant="h6">
                        {currentNetwork}
                    </Typography>
                </Grid>
            </Grid>

            <Grid container sx={{ mt: 3 }}>
                <Grid item xs={4}>
                    <Typography variant="h6">
                        Balance
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography variant="h6">
                        {ethers.utils.formatEther(balance ?? BigNumber.from('0'))} SYS
                    </Typography>
                </Grid>
            </Grid>

            <Grid container sx={{ mt: 3 }} spacing={2}>
                <Grid item xs={6}>
                    <Button variant="contained" onClick={() => {
                        addNetwork(1);
                    }} color="warning" sx={{ width: 1 }}>
                        Add L1 Network
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="contained" onClick={() => {
                        addNetwork(2);
                    }} color="warning" sx={{ width: 1 }}>
                        Add L2 Network
                    </Button>
                </Grid>
            </Grid>

            <Grid container sx={{ mt: 3 }}>
                <Grid item xs={12}>
                    <Button variant="contained" sx={{ width: 1 }} color='error' onClick={() => {
                        deactivate();
                        // cWalletLegacy.nevm.account = undefined;
                    }}>
                        Disconnect
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}