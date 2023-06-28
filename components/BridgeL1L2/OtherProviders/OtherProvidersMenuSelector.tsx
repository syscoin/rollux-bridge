import React, { FC, useCallback, useMemo, useState } from 'react';
import { Divider, Box, MenuItem, Menu, MenuButton, Icon, MenuList, HStack, Image, Text, Input, useBreakpointValue, PlacementWithLogical, Spacer } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { BridgedCEX, BridgedNetwork, FiatMethod } from '../../../blockchain/NevmRolluxBridge/bridgeProviders/types'; // replace this with the actual path to your enums
import { getKeyValue } from 'blockchain/NevmRolluxBridge/bridgeProviders/helpers';
import { FaChevronDown } from 'react-icons/fa';


export type OtherProvidersMenuSelectorProps = {
    onSelect: (provider: string) => void;
    preSelectLabel: string,
    preSelectedNetwork?: string,
}

// Enum keys
let cryptoKeys: string[] = Object.keys(BridgedNetwork).filter(k => isNaN(Number(k)));
let fiatKeys: string[] = Object.keys(FiatMethod).filter(k => isNaN(Number(k)));
let cexKeys: string[] = Object.keys(BridgedCEX).filter(k => isNaN(Number(k)));



export const OtherProvidersMenuSelector: FC<OtherProvidersMenuSelectorProps> = ({ onSelect, preSelectLabel, preSelectedNetwork = 'SYS' }) => {
    const [selectedInput, setSelectedInput] = useState<string>(preSelectedNetwork);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const filteredCryptoKeys = useMemo(() => cryptoKeys.filter(crypto =>
        crypto.toLowerCase().includes(searchTerm.toLowerCase()) || getKeyValue(crypto).toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]);

    const filteredFiatKeys = useMemo(() => fiatKeys.filter(fiat =>
        fiat.toLowerCase().includes(searchTerm.toLowerCase()) || getKeyValue(fiat).toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]);

    const filteredCEX = useMemo(() => cexKeys.filter(fiat =>
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
            <Text color={'gray.500'}>{preSelectLabel}</Text>
            <Menu isLazy lazyBehavior="unmount" placement={placement as PlacementWithLogical} autoSelect={false}>
                <MenuButton sx={{
                    borderRadius: "10px",
                    border: "1px solid",
                    borderColor: "gray.300",
                    p: 1,
                    _hover: {
                        bg: "gray.100",
                        borderColor: "gray.400",
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
                        <Icon as={FaChevronDown} color={'gray.500'} fontSize={12} mr={1} />
                        <Spacer />
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

                    <Divider />

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
                                <Text>{getKeyValue(fiat)}</Text>
                            </HStack>
                        </MenuItem>
                    ))}

                    <Divider />

                    {/* CEX Ways */}
                    <Box pl={4} py={2}>
                        <Text fontWeight="bold">Centralized Exchanges</Text>
                    </Box>

                    <Divider />

                    {filteredCEX.map((item) => (
                        <MenuItem
                            key={item}
                            onClick={() => handleSelect(item)}
                        >
                            <HStack>
                                <Image
                                    borderRadius="full"
                                    src={`/providers/icons/${item}.png`}
                                    fallbackSrc="https://via.placeholder.com/40"
                                    alt={`${item} logo`}
                                    boxSize={boxSize}
                                />
                                <Text>{getKeyValue(item)}</Text>
                            </HStack>
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </HStack>
    </>
    )
}
