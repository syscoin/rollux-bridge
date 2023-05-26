import { Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure, Image } from "@chakra-ui/react";
import React, { FC } from "react";

export type CoinifyProps = {
    imageUrl: string,
    modalUrl: string
}

export const Coinify: FC<CoinifyProps> = ({ imageUrl, modalUrl }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Box
                cursor="pointer"
                onClick={onOpen}
                w="100%"
                height={'90px'}
                borderWidth="1px"
                borderRadius="lg"
                borderColor="gray"
                transition="all 0.3s cubic-bezier(.08,.52,.52,1)"
                _hover={{
                    borderColor: "blue.500",
                    transform: "perspective(1000px) rotateY(10deg) rotateX(10deg)",
                    boxShadow: "0 4px 10px 1px rgba(0, 0, 0, 0.1)"
                }}
            >
                <Image src={imageUrl} alt={'logo'} borderRadius="full" objectFit="cover" w="100%" h={'100%'} />
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Coinify</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box as="iframe" src={modalUrl} width="100%" height="600px" />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default Coinify;
