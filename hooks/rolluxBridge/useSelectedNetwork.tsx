import contractsDev from "blockchain/NevmRolluxBridge/config/contracts";
import { useEthers, useSigner } from "@usedapp/core";
import { useEffect, useState, useCallback, useMemo } from "react";
import { CrossChainMessenger } from "@eth-optimism/sdk";
import { crossChainMessengerFactory } from "blockchain/NevmRolluxBridge/factories/CrossChainMessengerFactory";
import { ChainIdsToNetworksMap, networks, NetworkSwitchMap, SelectedNetworkType } from "blockchain/NevmRolluxBridge/config/networks";



export const useSelectedNetwork = () => {
    const [selectedNetwork, setSelectedNetwork] = useState<SelectedNetworkType>(SelectedNetworkType.Unsupported);
    const { chainId, switchNetwork, error } = useEthers();
    const [atWhichLayer, setAtWhichLayer] = useState<1 | 2 | undefined>(undefined);

    const {
        contractsL1,
        contractsL2,
        rpcL1,
        rpcL2,
        l1ChainId,
        l2ChainId
    }: {
        contractsL1: { [key: string]: string },
        contractsL2: { [key: string]: string },
        rpcL1: string,
        rpcL2: string,
        l1ChainId: number,
        l2ChainId: number
    } = useMemo(() => {
        if (selectedNetwork === SelectedNetworkType.Mainnet) {
            return {
                contractsL1: networks.L1.contracts,
                contractsL2: networks.L2.contracts,
                rpcL1: networks.L1.rpcAddress,
                rpcL2: networks.L2.rpcAddress,
                l1ChainId: networks.L1.chainId,
                l2ChainId: networks.L2.chainId,
            }
        }

        if (selectedNetwork === SelectedNetworkType.Testnet) {
            return {
                contractsL1: networks.L1Dev.contracts,
                contractsL2: networks.L2Dev.contracts,
                rpcL1: networks.L1Dev.rpcAddress,
                rpcL2: networks.L2Dev.rpcAddress,
                l1ChainId: networks.L1Dev.chainId,
                l2ChainId: networks.L2Dev.chainId,
            }
        }

        return {
            contractsL1: {},
            contractsL2: {},
            rpcL1: '',
            rpcL2: '',
            l1ChainId: 100000001,
            l2ChainId: 100000000,
        }

    }, [selectedNetwork]);


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
            console.error('No target network');
            return;
        }

        const targetChainID: number = currentLayer === 1 ? targetNetwork.L1 : targetNetwork.L2;

        await switchNetwork(targetChainID);
        // @ts-ignore
        setAtWhichLayer(currentLayer);
    }




    // // hardcoded variables for now while we have only testnet
    // const contractsL1 = contractsDev.l1_dev;
    // const contractsL2 = contractsDev.l2_dev;
    // const rpcL1 = networks.L1Dev.rpcAddress;
    // const rpcL2 = networks.L2Dev.rpcAddress;
    // const l1ChainId = 5700;
    // const l2ChainId = 57000;

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

