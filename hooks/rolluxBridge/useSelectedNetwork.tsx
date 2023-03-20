import contractsDev from "blockchain/NevmRolluxBridge/config/contracts";
import { useEthers, useSigner } from "@usedapp/core";
import { useEffect, useState } from "react";
import { CrossChainMessenger } from "@eth-optimism/sdk";
import { crossChainMessengerFactory } from "blockchain/NevmRolluxBridge/factories/CrossChainMessengerFactory";
import { networks } from "blockchain/NevmRolluxBridge/config/networks";

enum selectedNetworkEnum {
    'test',
    'main'
}


export const useSelectedNetwork = () => {
    const selectedNetwork = selectedNetworkEnum.test;
    const { chainId } = useEthers();
    const [atWhichLayer, setAtWhichLayer] = useState<1 | 2 | undefined>(undefined);


    // hardcoded variables for now while we have only testnet
    const contractsL1 = contractsDev.l1_dev;
    const contractsL2 = contractsDev.l2_dev;
    const rpcL1 = networks.L1Dev.rpcAddress;
    const rpcL2 = networks.L2Dev.rpcAddress;
    const l1ChainId = 5700;
    const l2ChainId = 57000;

    useEffect(() => {
        if (!chainId) {
            setAtWhichLayer(undefined)
        } else {
            // todo add more for mainnet/testnet
            setAtWhichLayer(chainId === 57000 ? 2 : 1);
        }
    }, [chainId])



    return { selectedNetwork, contractsL1, contractsL2, atWhichLayer, rpcL1, rpcL2, l1ChainId, l2ChainId }
}

