import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { OtherBridgeComponentBaseProps } from "blockchain/NevmRolluxBridge/bridgeProviders/types";
import React, { FC } from "react";
import { ProviderCard } from "../ProviderCard";
import Bridge from "@chainge/plugin"

export const ChaingeProvider: FC<OtherBridgeComponentBaseProps> = ({
    bridgeDetails,
    mode,
    payload,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleButtonClick = () => {
        console.log('1');
        onOpen();
    };

    return (
        <>
            <ProviderCard
                config={bridgeDetails}
                onButtonClick={handleButtonClick}
            />
            <Modal isOpen={isOpen} onClose={onClose} size={'3xl'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Chainge Bridge</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Bridge
                            feeLevel={0}
                            options={{
                                appKey: "xtanYqBGfNAg9R1axSF2uBJPzc8v8pS4FdyqFnp1XedX7CUB8paJ21gD3yG4JJd9",
                            }}
                            defaultParams={{
                                fromChain: 'ETH',
                                toChain: 'SYS',
                                toToken: 'SYS',
                            }}
                        ></Bridge>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
