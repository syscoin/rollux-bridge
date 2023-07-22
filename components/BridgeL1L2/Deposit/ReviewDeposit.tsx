import { Modal, ModalBody, Button, Text, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, ModalFooter, Flex, HStack, Spacer, Divider, VStack, Spinner, Link, Icon } from "@chakra-ui/react";
import { useNotifications } from "@usedapp/core";
import { useSelectedNetwork } from "hooks/rolluxBridge/useSelectedNetwork";
import useTxState from "hooks/rolluxBridge/useTxState";
import React, { FC, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdInfo, MdWarning } from "react-icons/md";
import { useAppSelector } from "store";

export type ReviewDepositProps = {
    children: React.ReactNode;
    isDisabled: boolean;
    amount: number,
    coinName: string,
    gasFee: number,
    estimatedFiatFee: number,
    isDepositLoading: boolean,
    depositTxHash: string | undefined,
    onOpenModal: () => void;
}

export const ReviewDeposit: FC<ReviewDepositProps> = ({ children, isDisabled, amount, coinName, gasFee, estimatedFiatFee, isDepositLoading, onOpenModal, depositTxHash }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { selectedNetwork, getExplorerLink } = useSelectedNetwork();

    const {
        resetAllErrors,
    } = useTxState();

    const hasDepositErrors = useAppSelector(state => state.rootReducer.AppState.isDepositTxRejected);
    const hasPendingDeposit = useAppSelector(state => state.rootReducer.AppState.isDepositTxSent);


    const handleOpen = () => {
        resetAllErrors();
        onOpen()
        onOpenModal();
    }

    const tryAgain = () => {
        resetAllErrors();
        onClose();
    }

    return (<>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />

            {(depositTxHash === undefined && !hasDepositErrors) && <>
                {!isDepositLoading && <>
                    <ModalContent>
                        <ModalHeader>Review deposit</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <HStack mb={2}>
                                <Text>Amount:</Text>
                                <Spacer />
                                <Text>{amount} {coinName}</Text>
                            </HStack>
                            <Divider />
                            <HStack mb={2}>
                                <Text>Estimated fee:</Text>
                                <Spacer />
                                <Text>{gasFee} SYS</Text>
                            </HStack>
                            <Divider />
                            <HStack mb={2}>
                                <Text>Estimated fiat fee:</Text>
                                <Spacer />
                                <Text>$ {estimatedFiatFee}</Text>
                            </HStack>
                            <Divider />

                        </ModalBody>
                        <ModalFooter>
                            <Flex flex={1} flexDirection={'row'} width={'100%'}>
                                {children}
                            </Flex>
                        </ModalFooter>
                    </ModalContent>
                </>}
                {isDepositLoading && <>
                    <ModalContent>
                        <ModalHeader textAlign={'center'}>
                            Transaction initialization
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack gap={3} justifyContent={'center'}>
                                <Text>Initiate deposit transaction...</Text>
                                <Spacer />
                                <Spinner mb={5} />
                                <Spacer />
                            </VStack>

                        </ModalBody>
                    </ModalContent>
                </>}

            </>}


            {(hasDepositErrors) && <>
                <ModalContent>
                    <ModalHeader textAlign={'center'}>
                        Transaction rejected
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalFooter>
                        <Flex flex={1} flexDirection={'row'} width={'100%'}>
                            <Button
                                variant={'primary'}
                                onClick={() => tryAgain()}
                                width={'100%'}
                            >
                                Try again
                            </Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </>
            }

            {(depositTxHash !== undefined) && <>
                <ModalContent>
                    <ModalHeader textAlign={'center'}>
                        <HStack>
                            <Icon as={FaCheckCircle} />
                            <Text fontSize={'xl'}>
                                Deposit transaction sent
                            </Text>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack gap={3} justifyContent={'center'} w={'100%'}>
                            <Button w={'100%'} variant={'primary'}
                                onClick={() => {
                                    window.open(getExplorerLink(selectedNetwork, 1, 'tx', depositTxHash || ''), '_blank');
                                }}
                            >
                                View on explorer
                            </Button>


                        </VStack>

                    </ModalBody>
                </ModalContent>
            </>}
        </Modal>

        <Button
            isDisabled={isDisabled}
            variant={'primary'}
            onClick={() => handleOpen()}
        >
            Review deposit
        </Button>

        {hasPendingDeposit && <>
            <HStack>
                <Icon as={MdInfo} fontSize={'xl'} color={'gray.500'} />

                <Text fontSize={'md'} mt={2}>
                    There is already a pending deposit transaction.
                </Text>
            </HStack>
        </>}
    </>);
}

export default ReviewDeposit;