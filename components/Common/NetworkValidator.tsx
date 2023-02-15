import { useEthers } from "@usedapp/core";
import { RolluxChain, TanenbaumChain } from "blockchain/NevmRolluxBridge/config/chainsUseDapp";
import React, { FC, useCallback, useEffect } from "react";

type NetworkValidatorProps = {
    children: React.ReactNode
}

const allowedChainIds: number[] = [
    TanenbaumChain.chainId,
    RolluxChain.chainId
]

export const NetworkValidator: FC<NetworkValidatorProps> = ({ children }) => {
    const { account, chainId, switchNetwork } = useEthers();


    useEffect(() => {
        if (account && chainId) {
            // if connected wallet.
            if (!allowedChainIds.includes(chainId)) {
                switchNetwork(allowedChainIds[0])
            }

        }
    }, [chainId, account, switchNetwork]);

    return (<>
        {children}
    </>)
}