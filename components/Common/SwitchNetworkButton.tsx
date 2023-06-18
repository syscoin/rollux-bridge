import { useEthers } from "@usedapp/core";
import React, { FC } from "react";
import { Button, Flex } from "@chakra-ui/react";


export type SwitchNetworkButtonProps = {
    requiredChainId: number,
    onClickSwitch: () => void,
    children: React.ReactNode,
    width?: string,
}

export const SwitchNetworkButton: FC<SwitchNetworkButtonProps> = ({ requiredChainId, onClickSwitch, children, width = '35vw' }) => {
    const { chainId } = useEthers();

    if (chainId && chainId === requiredChainId) {
        return <>{children}</>
    }

    return <>
        <Flex align={'center'} justify={'center'}>
            <Button variant={'primary'} width={width} onClick={() => onClickSwitch()}
            >
                Switch Network
            </Button>
        </Flex>
    </>
}