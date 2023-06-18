/**
 *
 * Crunch for support wagmi and rainbowkit with usedapp. (no reason to spend time , better migrate to wagmi and rainbow and remove usedapp)
 *
 * @todo migrate to wagmi and rainbowkit and remove usedapp
 */

// import React, { FC, useEffect } from "react"
// import { Connector, ConnectorUpdateData, ConnectorEvent } from '@usedapp/core'
// import type { FallbackProvider } from '@ethersproject/providers'
// import { useAccount, useNetwork } from 'wagmi'
// import { useEthers } from '@usedapp/core'
// import { AbstractConnector } from '@web3-react/abstract-connector'
// import '@rainbow-me/rainbowkit/styles.css';
// import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
// import { configureChains, createConfig, WagmiConfig, Chain as WChain } from 'wagmi';
// import { syscoin } from 'wagmi/chains';
// import { publicProvider } from 'wagmi/providers/public';
// import { RolluxChainMainnet } from "blockchain/NevmRolluxBridge/config/chainsUseDapp";

// const rollux: WChain = {
//     id: 570,
//     name: 'Rollux',
//     network: 'rollux',
//     nativeCurrency: {
//         decimals: 18,
//         name: 'Syscoin',
//         symbol: 'SYS',
//     },
//     rpcUrls: {
//         public: { http: [RolluxChainMainnet.rpcUrl as string] },
//         default: { http: [RolluxChainMainnet.rpcUrl as string] },
//     },
//     blockExplorers: {
//         etherscan: { name: 'Explorer', url: RolluxChainMainnet.blockExplorerUrl as string },
//         default: { name: 'Explorer', url: RolluxChainMainnet.blockExplorerUrl as string },
//     },
//     contracts: {
//         multicall3: {
//             address: '0xef5C60145250b9De77bfb7D7fA68804494D6Bf5C',
//             blockCreated: 1,
//         },
//     },
// };

// const { chains, publicClient, webSocketPublicClient } = configureChains(
//     [
//         syscoin,
//         rollux,
//     ],
//     [publicProvider()]
// );

// const { connectors } = getDefaultWallets({
//     appName: 'Syscoin Rollux Bridge',
//     projectId: '6b7e7faf5a9e54e3c5f22289efa5975b',
//     chains,
// });

// const wagmiConfig = createConfig({
//     autoConnect: true,
//     connectors,
//     publicClient,
//     webSocketPublicClient,
// });

// export type RainbowKitAndWagmiProps = {
//     children?: React.ReactNode;
// }

// class UseDappConnector extends AbstractConnector {
//     constructor(
//         private readonly chainId: number,
//         private readonly address: string,
//         public readonly getProvider: () => Promise<FallbackProvider>,
//         public readonly deactivate = () => { },
//     ) {
//         super()
//     }

//     getChainId = async () => this.chainId
//     getAccount = async () => this.address
//     activate = async () => {
//         const provider = await this.getProvider()
//         await provider.ready
//         return {
//             account: this.address,
//             chainId: this.chainId,
//             provider,
//         }
//     }
// }


// export const RainbowKitAndWagmi: FC<RainbowKitAndWagmiProps> = ({ children }) => {

//     const { activate, deactivate } = useEthers()

//     const { address, connector } = useAccount()
//     const { chain } = useNetwork()

//     useEffect(() => {
//         if (!connector || !address || !chain) {
//             deactivate()
//             return
//         }
//         connector.getProvider().then(async (provider) => {
//             await provider.ready

//         })
//     }, [connector, chain, address, activate, deactivate])


//     return (<WagmiConfig config={wagmiConfig}>
//         <RainbowKitProvider chains={chains}>
//             {children}
//         </RainbowKitProvider>
//     </WagmiConfig>);
// }