import React, { FC } from "react"
import { useEthers } from "@usedapp/core"
import { Button } from "@chakra-ui/react"

export type ConnectedWalletButtonProps = {
    children: React.ReactNode
}

export const ConnectedWalletButton: FC<ConnectedWalletButtonProps> = ({ children }) => {
    const { account, activateBrowserWallet } = useEthers();

    if (account) {
        return <>{children}</>
    }

    return (<Button
        variant="primary"
        mt={4}
        px="32.5px"
        w={'100%'}
        onClick={() => activateBrowserWallet()}
    >
        Connect Wallet
    </Button>);
}

export default ConnectedWalletButton;