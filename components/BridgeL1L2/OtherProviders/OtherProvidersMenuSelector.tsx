import React, { FC, useEffect, useState } from 'react'
import { Divider, Box, MenuItem, Menu, MenuButton, MenuList, HStack, Image, Text } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { BridgedNetwork, FiatMethod } from '../../../blockchain/NevmRolluxBridge/bridgeProviders/types'; // replace this with the actual path to your enums

export type OtherProvidersMenuSelectorProps = {
    onSelect: (provider: string) => void;
}

export const OtherProvidersMenuSelector: FC<OtherProvidersMenuSelectorProps> = ({ onSelect }) => {
    const [selectedInput, setSelectedInput] = useState<string>('SYS');

    // Enum keys
    let cryptoKeys: string[] = Object.keys(BridgedNetwork).filter(k => isNaN(Number(k)));
    let fiatKeys: string[] = Object.keys(FiatMethod).filter(k => isNaN(Number(k)));

    // Select a provider
    const handleSelect = (provider: string) => {
        console.log(provider);
        setSelectedInput(provider);
        onSelect(provider);
    };

    return (
        <Menu isLazy lazyBehavior="unmount" placement="top-start" autoSelect={false}>
            <MenuButton minW="fit-content">
                <HStack>
                    {
                        selectedInput && (
                            <>
                                <Image
                                    borderRadius="full"
                                    src={`/providers/icons/${selectedInput}.png`}
                                    alt={`${selectedInput} logo`}
                                    boxSize="6"
                                />
                                <Text>
                                    {selectedInput}
                                </Text>
                            </>
                        )
                    }
                    <ChevronDownIcon fontSize="xl" />
                </HStack>
            </MenuButton>

            <MenuList maxH="300px" overflow="scroll" position="absolute" left="-100px" top="50px">
                {/* Crypto Currencies */}
                {cryptoKeys.map((crypto) => (
                    <MenuItem
                        key={crypto}
                        onClick={() => handleSelect(crypto)}
                    >
                        <HStack>
                            <Image
                                borderRadius="full"
                                src={`/providers/icons/${crypto}.png`}
                                alt={`${crypto} logo`}
                                boxSize="4"
                                fallbackSrc="/fallback-image.png" // replace with your actual fallback image path
                            />
                            <Text>{crypto}</Text>
                        </HStack>
                    </MenuItem>
                ))}

                <Divider />

                {/* Fiat Currencies */}
                <Box pl={4} py={2}>
                    <Text fontWeight="bold">Fiat Currencies</Text>
                </Box>

                {fiatKeys.map((fiat) => (
                    <MenuItem
                        key={fiat}
                        onClick={() => handleSelect(fiat)}
                    >
                        <HStack>
                            <Image
                                borderRadius="full"
                                src={`/providers/icons/${fiat}.png`}
                                alt={`${fiat} logo`}
                                boxSize="4"
                                fallbackSrc="/fallback-image.png" // replace with your actual fallback image path
                            />
                            <Text>{fiat}</Text>
                        </HStack>
                    </MenuItem>

                ))}
            </MenuList>
        </Menu>
    )
}
