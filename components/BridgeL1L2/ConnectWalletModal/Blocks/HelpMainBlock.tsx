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
    ModalCloseButton,
    Box,
    Heading,

} from "@chakra-ui/react"

import {
    QuestionIcon,
    CloseIcon,
    ArrowBackIcon,
    LockIcon
} from "@chakra-ui/icons"
import CloseButton from "../CloseButton";
import BackButton from "../BackButton";

export type HelpMainBlockProps = {
    setScreen: (value: string) => void;
    onClose: () => void;
}

export const HelpMainBlock: FC<HelpMainBlockProps> = ({ setScreen, onClose }) => {
    return (<>
        <ModalHeader>
            <HStack spacing={4}>
                <BackButton setScreen={setScreen} />
                <Spacer />
                <Text textAlign={'center'}>What is a Wallet?</Text>
                <Spacer />
                <CloseButton onClose={onClose} setScreen={setScreen} />
            </HStack>
        </ModalHeader>
        <Divider />
        <ModalBody>
            <HStack spacing={4} mb={3}>
                <QuestionIcon />
                <Spacer />
                <Box>
                    <Heading size="sm">A Home for your Digital Assets</Heading>
                    <Text>Wallets are how you interact with Web3. They allow you to store, send, and receive digital assets like SYS and NFTs.</Text>
                </Box>
            </HStack>
            <HStack spacing={4} mb={3}>
                <LockIcon />
                <Spacer />
                <Box>
                    <Heading size="sm">A New Way to Log In</Heading>
                    <Text>
                        Instead of creating new accounts and passwords on every website, just connect your wallet.
                    </Text>
                </Box>
            </HStack>
            <Divider />
            <VStack spacing={4} mt={3} justifyContent={'center'}>
                <Button variant={'primary'} onClick={() => {
                    setScreen('get-wallet');
                }}>Get a Wallet</Button>
                <Button variant="outline">Learn More</Button>
            </VStack>
        </ModalBody>
    </>);
}