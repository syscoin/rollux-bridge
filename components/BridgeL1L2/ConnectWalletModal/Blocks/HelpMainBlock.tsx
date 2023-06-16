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

export type HelpMainBlockProps = {
    setScreen: (value: string) => void;
    onClose: () => void;
}

export const HelpMainBlock: FC<HelpMainBlockProps> = ({ setScreen, onClose }) => {
    return (<>
        <ModalHeader>
            <HStack spacing={4}>
                <IconButton aria-label="Info" icon={<ArrowBackIcon />} />
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
        </ModalBody>
    </>);
}