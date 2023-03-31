import contractsDev from "blockchain/NevmRolluxBridge/config/contracts";
import { useEthers, useSigner } from "@usedapp/core";
import { useEffect, useState, useCallback } from "react";
import { CrossChainMessenger } from "@eth-optimism/sdk";
import { crossChainMessengerFactory } from "blockchain/NevmRolluxBridge/factories/CrossChainMessengerFactory";
import { ChainIdsToNetworksMap, networks, NetworkSwitchMap, SelectedNetworkType } from "blockchain/NevmRolluxBridge/config/networks";



export const useSelectedNetwork = () => {
    const [selectedNetwork, setSelectedNetwork] = useState<SelectedNetworkType>(SelectedNetworkType.Unsupported);
    const { chainId, switchNetwork } = useEthers();
    const [atWhichLayer, setAtWhichLayer] = useState<1 | 2 | undefined>(undefined);

    const getExplorerLink = (network: SelectedNetworkType, layer: number, entity: string, hash: string): string => {
        if (network === SelectedNetworkType.Unsupported) return '';

        return `${networks[`L${layer}${network === SelectedNetworkType.Testnet ? 'Dev' : ''}`].explorerUrl}/${entity}/${hash}`;
    }

    const changeNetworks = async (newNetwork: SelectedNetworkType, currentLayer: number) => {
        if (newNetwork === SelectedNetworkType.Unsupported) {
            throw new Error("Unable to change to unsupported network.");
        }

        const targetNetwork: { L1: number, L2: number } | undefined = NetworkSwitchMap[newNetwork];

        if (!targetNetwork) {
            return;
        }

        const targetChainID: number = currentLayer === 1 ? targetNetwork.L1 : targetNetwork.L2;
        await switchNetwork(targetChainID);
        // @ts-ignore
        setAtWhichLayer(currentLayer);
    }




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
            setSelectedNetwork(SelectedNetworkType.Unsupported);
        } else {

            let _layer: number | undefined = undefined;

            Object.keys(NetworkSwitchMap).find((value: any) => {

                if (_layer !== undefined) {
                    return;
                }

                _layer = chainId === NetworkSwitchMap[value as SelectedNetworkType].L1 ? 1 : 2;
            })

            setAtWhichLayer(_layer)
            setSelectedNetwork(ChainIdsToNetworksMap[chainId]);
        }
    }, [chainId])



    return {
        selectedNetwork,
        contractsL1,
        contractsL2,
        atWhichLayer,
        rpcL1,
        rpcL2,
        l1ChainId,
        l2ChainId,
        changeNetworks,
        getExplorerLink
    }
}

