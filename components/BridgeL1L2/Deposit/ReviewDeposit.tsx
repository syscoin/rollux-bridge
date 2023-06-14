import { Modal, ModalBody, Button, Text, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, ModalFooter, Flex } from "@chakra-ui/react";
import React, { FC } from "react";

export type ReviewDepositProps = {
    children: React.ReactNode;
    isDisabled: boolean;
}

export const ReviewDeposit: FC<ReviewDepositProps> = ({ children, isDisabled }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (<>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Review deposit</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>Review deposit</Text>
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