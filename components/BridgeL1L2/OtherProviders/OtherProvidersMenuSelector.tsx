import React, { FC, useCallback, useMemo, useState } from 'react';
import { Divider, Box, MenuItem, Menu, MenuButton, MenuList, HStack, Image, Text, Input, useBreakpointValue, PlacementWithLogical, Spacer } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { BridgedNetwork, FiatMethod } from '../../../blockchain/NevmRolluxBridge/bridgeProviders/types'; // replace this with the actual path to your enums
import { getKeyValue } from 'blockchain/NevmRolluxBridge/bridgeProviders/helpers';

export type OtherProvidersMenuSelectorProps = {
    onSelect: (provider: string) => void;
    preSelectLabel: string,
}

// Enum keys
let cryptoKeys: string[] = Object.keys(BridgedNetwork).filter(k => isNaN(Number(k)));
let fiatKeys: string[] = Object.keys(FiatMethod).filter(k => isNaN(Number(k)));



export const OtherProvidersMenuSelector: FC<OtherProvidersMenuSelectorProps> = ({ onSelect, preSelectLabel }) => {
    const [selectedInput, setSelectedInput] = useState<string>('SYS');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const filteredCryptoKeys = useMemo(() => cryptoKeys.filter(crypto =>
        crypto.toLowerCase().includes(searchTerm.toLowerCase()) || getKeyValue(crypto).toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]);

    const filteredFiatKeys = useMemo(() => fiatKeys.filter(fiat =>
        fiat.toLowerCase().includes(searchTerm.toLowerCase()) || getKeyValue(fiat).toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]);



    // Select a provider
    const handleSelect = (provider: string) => {
        // console.log(provider);
        setSelectedInput(provider);
        onSelect(provider);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Responsive design variables
    const boxSize = useBreakpointValue({ base: "15px", md: "20px", lg: "25px", xl: "30px" });
    const placement = useBreakpointValue({ base: "bottom", md: "top-end" });

    return (<>
        <HStack>
            <Text ml={3}>{preSelectLabel}</Text>
            <Menu isLazy lazyBehavior="unmount" placement={placement as PlacementWithLogical} autoSelect={false}>
                <MenuButton sx={{
                    borderRadius: "10px",
                    border: "1px solid #E2E8F0",
                    p: 1,
                    _hover: {
                        bg: "gray.100",
                    },
                }}>
                    <HStack>
                        <Spacer />
                        <Image
                            borderRadius="full"
                            src={`/providers/icons/${selectedInput}.png`}
                            fallbackSrc="https://via.placeholder.com/40"
                            alt={`${selectedInput} logo`}
                            boxSize={boxSize}
                        />

                        <Text fontWeight="700">
                            {getKeyValue(selectedInput)}
                        </Text>
                        <Spacer />
                        <ChevronDownIcon fontSize="xl" />
                    </HStack>
                </MenuButton>

                <MenuList maxH="300px" overflow="scroll" position="absolute" left={placement === "end" ? "0" : "-100px"} top="50px">
                    {/* Search Input */}
                    <Box p={4}>
                        <Input
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </Box>

                    {/* Crypto Currencies */}
                    {filteredCryptoKeys.map((crypto) => (
                        <MenuItem
                            key={crypto}
                            onClick={() => handleSelect(crypto)}
                        >
                            <HStack>
                                <Image
                                    borderRadius="full"
                                    src={`/providers/icons/${crypto}.png`}
                                    fallbackSrc="https://via.placeholder.com/40"
                                    alt={`${crypto} logo`}
                                    boxSize={boxSize}
                                />
                                <Text>{getKeyValue(crypto)}</Text>
                            </HStack>
                        </MenuItem>
                    ))}

                    <Divider />

                    {/* Fiat Currencies */}
                    <Box pl={4} py={2}>
                        <Text fontWeight="bold">Fiat Currencies</Text>
                    </Box>

                    {filteredFiatKeys.map((fiat) => (
                        <MenuItem
                            key={fiat}
                            onClick={() => handleSelect(fiat)}
                        >
                            <HStack>
                                <Image
                                    borderRadius="full"
                                    src={`/providers/icons/${fiat}.png`}
                                    fallbackSrc="https://via.placeholder.com/40"
                                    alt={`${fiat} logo`}
                                    boxSize={boxSize}
                                />
                                <Text>{fiat}</Text>
                            </HStack>
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </HStack>
    </>
    )
}
