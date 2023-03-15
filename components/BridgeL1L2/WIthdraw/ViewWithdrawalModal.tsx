import { MessageStatus } from "@eth-optimism/sdk"
import React, { FC } from "react"
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter, Button, ModalHeader, Text, ModalCloseButton, Heading, List, ListItem } from "@chakra-ui/react"
import CrossChainMessageStatusLabel from "../CrossChainMessageStatusLabel"

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
                    <List>
                        <ListItem>
                            <Heading size="xs">TXN ID</Heading> {txnHash}
                        </ListItem>
                        <ListItem>
                            <Heading size="xs">Status</Heading> <CrossChainMessageStatusLabel status={status} />
                        </ListItem>
                    </List>
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