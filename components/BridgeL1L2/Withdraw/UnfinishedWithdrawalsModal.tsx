import React, { FC } from "react"
import { Flex, Heading, AlertIcon, Box, useDisclosure, Modal, ModalBody, ModalOverlay, ModalHeader, ModalCloseButton, ModalContent, Alert } from "@chakra-ui/react"
import { chakraTheme } from 'components/chakraTheme';

export type UnfinishedWithdrawalsModalProps = {
    children: React.ReactNode;
}

export const UnfinishedWithdrawalsModal: FC<UnfinishedWithdrawalsModalProps> = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Alert cursor={'pointer'} status="warning" sx={{ marginBottom: 3 }} onClick={onOpen}>
                <AlertIcon />
                <Heading size="sm">Manage pending withdrawals</Heading>
            </Alert>
            <Modal isOpen={isOpen} onClose={onClose} size={'sm'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontStyle={'italic'}>Manage pending withdrawals</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex
                            px={{ base: '8px', md: '20px' }}
                            py={{ base: '8px', md: '16px' }}
                            flex={1}
                            bg="white"
                            boxShadow={`7px 7px ${chakraTheme.colors.brand.primary}`}
                            borderRadius="12px"
                            border={`1px solid ${chakraTheme.colors.brand.primary}`}
                            justifyContent="center"
                            flexDir="column"
                            m="0 0 30px 0"


                            overflow={"scroll-y"}
                            z-index={1}
                        >
                            <Box overflow={'scroll'}>
                                {children}
                            </Box>
                        </Flex>
                    </ModalBody>
                </ModalContent>

            </Modal>
        </>
    )
}