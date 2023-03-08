import { Network } from "bitcoinjs-lib";
import contractsDev from "./contracts";

export type NetworkData = {
    rpcAddress: string,
    name: string,
    explorerUrl: string,
    chainId: number,
    layer: number,
    contracts: { [key: string]: string }
}



export const networksMap: { [key: string]: string } = {
    'L1Dev': 'RolluxBedrockDev',
    'RolluxBedrockDev': 'L1Dev'
};

export const networks: { [key: string]: NetworkData } = {
    L1: {
        rpcAddress: 'https://rpc.tanenbaum.io',
        name: 'sysNeVM',
        explorerUrl: 'https://tanenbaum.io',
        chainId: 5701,
        layer: 1,
        contracts: {}
    },
    L1Dev: {
        rpcAddress: 'https://rpc.tanenbaum.io',
        name: 'L1Dev',
        explorerUrl: 'https://tanenbaum.io',
        chainId: 5700,
        layer: 1,
        contracts: contractsDev.l1_dev,
    },
    L2Dev: {
        rpcAddress: 'https://rpc-bedrock.rollux.com/',
        name: 'RolluxBedrockDev',
        explorerUrl: 'https://explorer.testnet.rollux.com',
        chainId: 57000,
        layer: 2,
        contracts: contractsDev.l2_dev,
    }
}

export const getNetworkByChainId = (chainId: number, networks: { [key: string]: NetworkData }): NetworkData | undefined => {
    let found: NetworkData | undefined = undefined;

    Object.keys(networks).forEach(element => {
        const network: NetworkData = networks[element];

        if (network.chainId === chainId && typeof found === 'undefined') {
            found = network;
        }
    });

    return found;
}

export const getNetworkByName = (name: string, networks: { [key: string]: NetworkData }): NetworkData | undefined => {
    let found: NetworkData | undefined = undefined;

    Object.keys(networks).forEach(element => {
        const network: NetworkData = networks[element];

        if (network.name === name && typeof found === 'undefined') {
            found = network;
        }
    });

    return found;
}