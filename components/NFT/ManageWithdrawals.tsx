import { MessageStatus } from '@eth-optimism/sdk';
import React, { FC } from 'react'
import { Alert, AlertIcon, AlertDescription, Button, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure, Box, Text, IconButton, useClipboard } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { useEthers } from '@usedapp/core';
import { useSelectedNetwork } from 'hooks/rolluxBridge/useSelectedNetwork';

export type ManageWithdrawalsProps = {
    pendingWithdrawals: { status: MessageStatus, txHash: string }[],
    onClickProveMessage: (txId: string) => void,
    onClickFinalizeMessage: (txId: string) => void;
}

const messageStatusToString = {
    [MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE]: "Unconfirmed L1 to L2 Message",
    [MessageStatus.FAILED_L1_TO_L2_MESSAGE]: "Failed L1 to L2 Message",
    [MessageStatus.STATE_ROOT_NOT_PUBLISHED]: "State Root Not Published",
    [MessageStatus.READY_TO_PROVE]: "Ready to Prove",
    [MessageStatus.IN_CHALLENGE_PERIOD]: "In Challenge Period",
    [MessageStatus.READY_FOR_RELAY]: "Ready for Relay",
    [MessageStatus.RELAYED]: "Relayed",
};

const shortenTxHash = (txHash: string) => txHash.substring(0, 6) + '...' + txHash.substring(txHash.length - 4);

export const ManageWithdrawals: FC<ManageWithdrawalsProps> = ({
    pendingWithdrawals, onClickFinalizeMessage, onClickProveMessage
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { hasCopied, onCopy, setValue } = useClipboard("");

    const { switchNetwork, chainId } = useEthers();
    const { l1ChainId } = useSelectedNetwork();

    const copyTxHash = (txHash: string) => {
        setValue(txHash)
        onCopy()
    }

    return (
        <>
            {(pendingWithdrawals.length > 0) && <>
                <Alert status={'info'}>
                    <AlertIcon />
                    <AlertDescription>
                        You have unfinished withdrawals from L2 to L1. Please click button below this message for manage it.
                    </AlertDescription>
                </Alert>
                <Flex justifyContent={'center'} mt={3}>
                    <Button variant={'primary'} onClick={onOpen}>Manage NFT Withdrawals</Button>
                </Flex>

                <Modal isOpen={isOpen} onClose={onClose} size="xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Pending Withdrawals</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Flex direction="column" align="stretch" w="full">
                                {pendingWithdrawals.map((withdrawal, index) => (
                                    <Flex key={index} justify="space-between" align="center" border="1px" borderColor="gray.200" borderRadius="md" p={3} mb={3}>
                                        <Box flex="1" display="flex" alignItems="center">
                                            <Text isTruncated mr={2}>{shortenTxHash(withdrawal.txHash)}</Text>
                                            <IconButton aria-label="Copy txHash" icon={<CopyIcon />} size="xs" onClick={() => copyTxHash(withdrawal.txHash)} />
                                        </Box>
                                        <Box flex="1">
                                            <Text isTruncated>{messageStatusToString[withdrawal.status]}</Text>
                                        </Box>
                                        <Box flex="1">
                                            {withdrawal.status === MessageStatus.READY_TO_PROVE ? (
                                                <>
                                                    {chainId === l1ChainId && <>
                                                        <Button variant={'primary'} onClick={() => onClickProveMessage(withdrawal.txHash)}>Prove Message</Button>
                                                    </>}
                                                    {chainId !== l1ChainId && <>
                                                        <Button variant={'primary'} onClick={() => switchNetwork(l1ChainId)}>Switch to L1</Button>
                                                    </>}
                                                </>
                                            ) : withdrawal.status === MessageStatus.READY_FOR_RELAY ? (
                                                <>
                                                    {chainId === l1ChainId && <>
                                                        <Button variant={'primary'} onClick={() => onClickFinalizeMessage(withdrawal.txHash)}>Finalize Message</Button>
                                                    </>}
                                                    {chainId !== l1ChainId && <>
                                                        <Button variant={'primary'} onClick={() => switchNetwork(l1ChainId)}>Switch to L1</Button>
                                                    </>}
                                                </>
                                            ) : (
                                                <>Processing</>
                                            )}
                                        </Box>
                                    </Flex>
                                ))}
                            </Flex>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </>}
        </>
    )
}

export default ManageWithdrawals;
