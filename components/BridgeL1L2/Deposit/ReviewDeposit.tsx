import { Modal, ModalBody, Button, Text, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, ModalFooter, Flex, HStack, Spacer, Divider, VStack, Spinner, Link } from "@chakra-ui/react";
import { useSelectedNetwork } from "hooks/rolluxBridge/useSelectedNetwork";
import React, { FC } from "react";

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


    const handleOpen = () => {
        onOpen()
        onOpenModal();
    }

    return (<>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
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

            {(depositTxHash !== undefined) && <>
                <ModalContent>
                    <ModalHeader textAlign={'center'}>
                        Deposit transaction sent
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack gap={3} justifyContent={'center'}>
                            <Text>Deposit transaction sent...</Text>
                            <Spacer />
                            <Link target={'_blank'} href={getExplorerLink(selectedNetwork, 1, 'tx', depositTxHash || '')} >
                                <Text color={'blue.500'}>View on explorer</Text>
                            </Link>


                        </VStack>

                    </ModalBody>
                </ModalContent>
            </>}
        </Modal>

        <Button
            isDisabled={isDisabled}
            variant={'primary'}
            onClick={handleOpen}
        >
            Review deposit
        </Button>
    </>);
}

export default ReviewDeposit;