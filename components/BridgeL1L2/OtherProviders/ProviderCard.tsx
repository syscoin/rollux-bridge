import { Card, CardBody, Button, Text, Flex, Image, Box, Link, Spacer, IconButton, HStack, VStack, Icon } from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { OtherBridgeProvider } from "blockchain/NevmRolluxBridge/bridgeProviders/types";
import React, { FC } from "react";
import { FaArrowUp, FaExternalLinkAlt, FaExternalLinkSquareAlt } from "react-icons/fa";

export type ProviderCardProps = {
    config: OtherBridgeProvider,
    onButtonClick: () => void,
}

export const ProviderCard: FC<ProviderCardProps> = ({ config, onButtonClick }) => {
    return (
        <Box maxH={'200px'} cursor="pointer" w={'100%'}
            onClick={onButtonClick}
            sx={{
                '&:hover': {
                    transform: 'scale(1.02) translate(0px, -2px) !important',
                    boxShadow: '0 0 0 1px #68D391, 0 0 0 1px #68D391',
                },
                '&:active': {
                    transform: 'scale(1.02) translate(0px, -2px) !important',
                    boxShadow: '0 0 0 1px #68D391, 0 0 0 1px #68D391',
                },

                backgroundColor: 'white.300',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                padding: '15px',

            }}
        >
            <Box w={'100%'}>
                <HStack gap={1}>
                    <Box boxSize="48px">
                        <Image alt="logo" src={config.logoUrl ?? ''} fallbackSrc="https://via.placeholder.com/150" boxSize="100%" objectFit="contain"
                            sx={{
                                '&:hover': {
                                    transform: 'scale(1.02) translate(0px, -2px) !important',
                                },
                            }}
                        />
                    </Box>
                    <VStack gap={0} ml={2} alignItems={'left'}>
                        <Text fontSize={'lg'} >
                            {config.description}
                        </Text>
                        <Text fontSize={'sm'} color={'gray.400'}>
                            {config.url?.replace('https://', '').replace('http://', '')}
                        </Text>
                    </VStack>
                    <Spacer />
                    <Icon mr={3} as={FaExternalLinkAlt} color={'gray.500'} />
                </HStack>

            </Box>
        </Box>
    );
}
