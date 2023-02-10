import { CrossChainMessenger, ETHBridgeAdapter, SignerOrProviderLike } from "@eth-optimism/sdk";
import { NetworkData } from "../config/networks";

/**
 * Returns crosschain messenger 
 * 
 * 
 * @param l1Network 
 * @param l2Network 
 * @param l1Signer 
 * @param l2Signer 
 * @param bedrock 
 * @returns 
 */
export const crossChainMessengerFactory = (
    l1Network: NetworkData,
    l2Network: NetworkData,
    l1Signer: SignerOrProviderLike,
    l2Signer: SignerOrProviderLike,
    bedrock: boolean = true
): CrossChainMessenger => {
    return new CrossChainMessenger({
        l1SignerOrProvider: l1Signer,
        l2SignerOrProvider: l2Signer,
        l1ChainId: l1Network.chainId,
        l2ChainId: l2Network.chainId,
        bedrock: bedrock,
        contracts: { l1: l1Network.contracts, l2: l2Network.contracts },
        bridges: {
            ETH: {
                Adapter: ETHBridgeAdapter,
                l1Bridge: l1Network.contracts.L1StandardBridge,
                l2Bridge: l2Network.contracts.L2StandardBridge,
            }
        }
    })
}