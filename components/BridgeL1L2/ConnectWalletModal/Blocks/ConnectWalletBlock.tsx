import React, { FC } from "react";
import {
    ModalHeader,
    HStack,
    Divider,
    IconButton,
    Spacer,
    Text,
    ModalBody,
    Button,
    VStack,

} from "@chakra-ui/react"

import {
    QuestionIcon,
    CloseIcon
} from "@chakra-ui/icons"
import CloseButton from "../CloseButton";
import { useEthers } from "@usedapp/core";

export type ConnectWalletBlockProps = {
    setScreen: (value: string) => void;
    onClose: () => void;
}

export const ConnectWalletBlock: FC<ConnectWalletBlockProps> = ({ setScreen, onClose }) => {
    const { activateBrowserWallet } = useEthers();

    return (<>
        <ModalHeader>
            <HStack spacing={4}>
                <IconButton aria-label="Info" onClick={() => setScreen('help')} icon={<QuestionIcon />} />
                <Spacer />
                <Text textAlign={'center'}>Connect a Wallet</Text>
                <Spacer />
                <CloseButton onClose={onClose} setScreen={setScreen} />
            </HStack>
        </ModalHeader>
        <Divider />
        <ModalBody>
            <VStack spacing={1} justifyContent={'left'}>
                <Button w={'100%'} variant="secondary" onClick={() => {
                    activateBrowserWallet();
                }}>MetaMask</Button>
                <Button w={'100%'} variant="secondary" onClick={() => { }}>Pali Wallet</Button>
                <Button w={'100%'} variant="secondary" onClick={() => { }}>Rainbow</Button>
                <Button w={'100%'} variant="secondary" onClick={() => { }}>Coinbase Wallet</Button>
                <Button w={'100%'} variant="secondary" onClick={() => { }}>WalletConnect</Button>
                <Button w={'100%'} variant="secondary" onClick={() => { }}>Trust Wallet</Button>
            </VStack>
            <Divider mt={5} />
            <Text textAlign={'center'}>
                By connecting a wallet to use the Gateway you agree to the Gateway Terms, and to use the Rollux NFT service you agree to the Rollux NFT Terms & Conditions.
            </Text>
        </ModalBody>
    </>);
}

export default ConnectWalletBlock;