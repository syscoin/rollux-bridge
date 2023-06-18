import { Modal, ModalBody, Button, Text, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, ModalFooter, Flex, HStack, Spacer, Divider } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import React, { FC } from "react";

export type ReviewDepositProps = {
    children: React.ReactNode;
    isDisabled: boolean;
    amount: number,
    coinName: string,
    gasFee: number,
    estimatedFiatFee: number,
    isDepositLoading: boolean,
}

export const ReviewDeposit: FC<ReviewDepositProps> = ({ children, isDisabled, amount, coinName, gasFee, estimatedFiatFee, isDepositLoading }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();


    return (<>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
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
                        <Text>{gasFee} ETH</Text>
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
        </Modal>

        <Button
            isDisabled={isDisabled}
            variant={'primary'}
            onClick={onOpen}
        >
            Review deposit
        </Button>
    </>);
}

export default ReviewDeposit;