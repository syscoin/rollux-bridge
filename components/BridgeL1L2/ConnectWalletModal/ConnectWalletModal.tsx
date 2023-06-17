import React, { FC } from "react"
import { Button, Modal, ModalHeader, ModalContent, ModalOverlay, ModalBody, Divider, Spacer, VStack, IconButton, Text, HStack, CloseButton } from "@chakra-ui/react";
import { QuestionIcon } from "@chakra-ui/icons";
import ConnectWalletBlock from "./Blocks/ConnectWalletBlock";
import { HelpMainBlock } from "./Blocks/HelpMainBlock";
import { GetAWalletBlock } from "./Blocks/GetAWalletBlock";


export type ConnectWalletModalProps = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const sreensMapping: { [key: string]: any } = {
    'connect': ConnectWalletBlock,
    'help': HelpMainBlock,
    'get-wallet': GetAWalletBlock
}


export const ConnectWalletModal: FC<ConnectWalletModalProps> = ({ isOpen, onClose, onOpen }) => {
    const [screen, setScreen] = React.useState<string>('connect');

    return (<>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />

            <ModalContent>
                {React.createElement(sreensMapping[screen] || '<></>', { setScreen: setScreen, onClose: onClose })}
            </ModalContent>
        </Modal>
    </>);
}

export default ConnectWalletModal;