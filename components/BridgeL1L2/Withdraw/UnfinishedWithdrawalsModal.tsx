import React, { FC } from "react"
import { Flex, Heading, AlertIcon, Box, useDisclosure, Modal, ModalBody, ModalOverlay, ModalHeader, ModalCloseButton, ModalContent, Alert, Divider, Icon, HStack, Spacer } from "@chakra-ui/react"
import { chakraTheme } from 'components/chakraTheme';
import { MdCircle } from "react-icons/md";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { FaExclamationCircle } from "react-icons/fa";

export type UnfinishedWithdrawalsModalProps = {
    children: React.ReactNode;
}

export const UnfinishedWithdrawalsModal: FC<UnfinishedWithdrawalsModalProps> = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Flex flexDir="column" pb={4} pr={1} pl={1}>
                <Box
                    sx={{
                        backgroundColor: 'orange.100',
                        borderRadius: '4px',
                        p: 3,
                        pb: 4,
                        pt: 4,
                        cursor: 'pointer',
                    }}
                    onClick={onOpen}>
                    <HStack w={'100%'} gap={1} spacing={3}>
                        <Icon as={FaExclamationCircle} color={'orange.500'} />
                        <Heading size="sm">Manage pending withdrawals</Heading>
                        <Spacer />
                        <Spacer />
                        <Icon as={ExternalLinkIcon} color={'gray.500'} />
                    </HStack>
                </Box>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose} size={'lg'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontStyle={'italic'}>Manage pending withdrawals</ModalHeader>
                    <ModalCloseButton />
                    <Divider />
                    <ModalBody>
                        <Flex
                            px={{ base: '8px', md: '20px' }}
                            py={{ base: '8px', md: '16px' }}
                            flex={1}
                            bg="white"
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