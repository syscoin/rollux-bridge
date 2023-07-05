import { CrossChainMessenger } from "@eth-optimism/sdk";
import { useEthers, useSigner } from "@usedapp/core"
import { getChainById } from "@usedapp/core/dist/esm/src/helpers";
import { getNetworkByChainId } from "blockchain/NevmRolluxBridge/config/networks";
import { crossChainMessengerFactory } from "blockchain/NevmRolluxBridge/factories/CrossChainMessengerFactory";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useSelectedNetwork } from "./useSelectedNetwork";
import { networks } from "blockchain/NevmRolluxBridge/config/networks";

export const useCrossChainMessenger = () => {
    const signer = useSigner();
    const { contractsL1, contractsL2, atWhichLayer, rpcL1, rpcL2, l1ChainId, l2ChainId } = useSelectedNetwork();
    const [messenger, setMessenger] = useState<CrossChainMessenger | undefined>(undefined);
    const { chainId } = useEthers();


    useEffect(() => {
        if (!signer || !chainId || !atWhichLayer || !contractsL1 || !contractsL2 || !l1ChainId || !l2ChainId) {
            setMessenger(undefined);

            return;
        }

        const networkL1 = getNetworkByChainId(l1ChainId, networks);
        const networkL2 = getNetworkByChainId(l2ChainId, networks);

        if (!networkL1 || !networkL2) {
            setMessenger(undefined);

            return;
        }

        const _tmpMessenger = crossChainMessengerFactory(
            networkL1,
            networkL2,
            atWhichLayer === 1 ? signer : new ethers.providers.StaticJsonRpcProvider(rpcL1),
            atWhichLayer === 2 ? signer : new ethers.providers.StaticJsonRpcProvider(rpcL2),
            true
        );

        setMessenger(_tmpMessenger);
    }, [signer, atWhichLayer, chainId, contractsL1, contractsL2, rpcL1, rpcL2, l1ChainId, l2ChainId]);

    return messenger;
}