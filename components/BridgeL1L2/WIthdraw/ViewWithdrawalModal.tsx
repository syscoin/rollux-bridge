import { MessageStatus } from "@eth-optimism/sdk"
import React, { FC } from "react"
import { useClipboard, Modal, Badge, ModalOverlay, ModalContent, ModalBody, ModalFooter, Button, ModalHeader, Text, ModalCloseButton, Heading, List, ListItem, Flex } from "@chakra-ui/react"
import CrossChainMessageStatusLabel from "../CrossChainMessageStatusLabel"
import { shortenIfTransactionHash } from "@usedapp/core"

export type ViewWithdrawalModalProps = {
    txnHash: string,
    status: MessageStatus,
    isOpen: boolean,
    onClose: () => void,
    children: React.ReactNode
}

export const ViewWithdrawalModal: FC<ViewWithdrawalModalProps> = ({ children, txnHash, status, isOpen, onClose }) => {
    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay
                bg='blackAlpha.300'
                backdropFilter='blur(10px) hue-rotate(90deg)'
            />
            <ModalContent>
                <ModalHeader>Withdrawal Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <div>
                        {children}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default ViewWithdrawalModal;