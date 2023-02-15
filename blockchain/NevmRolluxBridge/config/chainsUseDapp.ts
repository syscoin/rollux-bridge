import { Chain } from "@usedapp/core";

export const NEVMChain: Chain = {
    chainId: 57,
    chainName: "Syscoin NEVM",
    isLocalChain: false,
    isTestChain: false,
    nativeCurrency: {
        name: "Syscoin",
        symbol: "SYS",
        decimals: 18,
    },
    multicallAddress: '',
    getExplorerAddressLink: (address: string) => {
        return address;
    },
    getExplorerTransactionLink: (address: string) => {
        return address;
    },
    rpcUrl: "https://rpc.syscoin.org",
    blockExplorerUrl: "https://explorer.syscoin.org/",
}

export const TanenbaumChain: Chain = {
    chainId: 5700,
    chainName: "Tanenbaum testnet",
    isLocalChain: false,
    isTestChain: false,
    nativeCurrency: {
        name: "tSyscoin",
        symbol: "tSYS",
        decimals: 18,
    },
    multicallAddress: '0x1F359C32b5D8c9678b076eAac411A4d2Eb11E697',
    multicall2Address: '0x1F359C32b5D8c9678b076eAac411A4d2Eb11E697',
    getExplorerAddressLink: (address: string) => {
        return address;
    },
    getExplorerTransactionLink: (address: string) => {
        return address;
    },
    rpcUrl: "https://rpc.tanenbaum.io",
    blockExplorerUrl: "https://tanenbaum.io",
}

export const RolluxChain: Chain = {
    chainId: 57000,
    chainName: "Rollux Bedrock Testnet",
    isLocalChain: false,
    isTestChain: false,
    nativeCurrency: {
        name: "bSyscoin",
        symbol: "bSYS",
        decimals: 18,
    },
    multicallAddress: '0x1F359C32b5D8c9678b076eAac411A4d2Eb11E697',
    multicall2Address: '0x1F359C32b5D8c9678b076eAac411A4d2Eb11E697',
    getExplorerAddressLink: (address: string) => {
        return address;
    },
    getExplorerTransactionLink: (address: string) => {
        return address;
    },
    rpcUrl: "https://bedrock.rollux.com:9545/",
    blockExplorerUrl: "https://blockscout.com/optimism/bedrock-alpha/",
}