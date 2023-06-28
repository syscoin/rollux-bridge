import React, { FC, useState, useEffect } from "react";
import TokenListToken from "blockchain/NevmRolluxBridge/interfaces/TokenListToken";
import { Button, Modal, Image, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, SimpleGrid, Spacer, Text, useDisclosure, HStack, List, ListItem, FormControl, FormLabel, Input, Icon } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import SelectTokenModalItem from "./SelectTokenModalItem";
import { ethers } from "ethers";
import SelectTokenBadge from "./SelectTokenBadge";
import { FaChevronDown } from "react-icons/fa"

export type SelectTokenModalProps = {
    tokens: TokenListToken[],
    onSelect: (token: { address: string, chainId: number, decimals: number, name: string, symbol: string, logoURI: string }) => void,
    chainId: number,
    selectedToken: { address: string, chainId: number, decimals: number, name: string, symbol: string, logoURI: string } | undefined,
    disableAdditionalStyling?: boolean,
}

export const SelectTokenModal: FC<SelectTokenModalProps> = ({ tokens, disableAdditionalStyling = false, chainId, onSelect, selectedToken }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [searchTerm, setSearchTerm] = useState<string>('')
    const [filteredTokens, setFilteredTokens] = useState<TokenListToken[]>([])
    const [popularTokens, setPopularTokens] = useState<TokenListToken[]>([])

    useEffect(() => {
        setFilteredTokens(tokens)



        const pTokens: TokenListToken[] = tokens.filter((token) => {
            if (token.symbol === 'USDT' || token.symbol === 'USDC' || token.symbol === 'DAI') {
                return true
            }
            return false;
        });

        pTokens.push(
            { address: ethers.constants.AddressZero, chainId: chainId, decimals: 18, name: 'Syscoin', symbol: 'SYS', logoURI: '/syscoin-logo.svg', extensions: { rolluxBridgeAddress: '' } } as TokenListToken
        );

        setPopularTokens(pTokens.reverse());
    }, [chainId, tokens])

    useEffect(() => {
        setFilteredTokens(tokens.filter((token) => {
            return token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || token.name.toLowerCase().includes(searchTerm.toLowerCase()) || token.address.toLowerCase().includes(searchTerm.toLowerCase())
        }))
    }, [searchTerm, tokens])



    const handleSelect = (token: { address: string, chainId: number, decimals: number, name: string, symbol: string, logoURI: string }) => {
        onSelect(token);
        onClose();
    }

    return (<>
        <Modal isOpen={isOpen} onClose={onClose} size={'lg'}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontStyle={'italic'}>Select token</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={4}>

                        <Input
                            boxShadow={'md'}
                            borderColor={'gray.500'}
                            placeholder={'Search by name or paste address'}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                    </FormControl>
                    <HStack justifyContent={'center'} mb={4} spacing={3}>
                        {popularTokens.map((token) => (
                            <SelectTokenBadge
                                key={token.symbol}
                                token={token}
                                onSelect={handleSelect}
                            />
                        ))}
                    </HStack>
                    <List justifyContent={'left'}
                        maxH={'400px'}
                        overflowY={'scroll'}
                    >
                        <SelectTokenModalItem
                            selected={selectedToken?.symbol === 'SYS'}
                            chainId={chainId}
                            address={ethers.constants.AddressZero}
                            decimals={18}
                            symbol={'SYS'}
                            name={'Syscoin'}
                            logoURI={'/syscoin-logo.svg'}
                            onSelect={handleSelect}
                        />
                        {filteredTokens.map((token) => (
                            <ListItem textAlign={'left'} mb={3} key={token.symbol}>
                                <SelectTokenModalItem
                                    selected={selectedToken?.symbol === token.symbol}
                                    chainId={chainId}
                                    decimals={token.decimals}
                                    address={token.address}
                                    symbol={token.symbol}
                                    name={token.name}
                                    logoURI={token.logoURI}
                                    onSelect={handleSelect}
                                />
                            </ListItem>
                        ))}
                    </List>
                </ModalBody>
            </ModalContent>
        </Modal>

        <Button
            variant={'primary'}
            onClick={onOpen}
            minW={'fit-content'}
            sx={disableAdditionalStyling ? {} : {
                margin: '0 !important',  // reset all margins
                marginInlineStart: '0px !important',  // reset margin-start
                borderLeftRadius: '0px !important',
                borderLeft: '1px solid !important',
                borderLeftColor: 'gray.300 !important',
                '&:hover': {
                    backgroundColor: 'brand.secondary',
                    color: 'black.200',
                }
            }}
        >
            <HStack>
                <Image
                    borderRadius="full"
                    src={selectedToken?.logoURI ?? '/syscoin-logo.svg'}
                    alt={`${selectedToken?.name ?? 'SYS'} logo`}
                    boxSize="6"
                />
                <Text>
                    {selectedToken ? selectedToken.symbol : ''}
                </Text>
                <Icon as={FaChevronDown} color={'gray.500'} fontSize={12} />
            </HStack>
        </Button>
    </>);
}

export default SelectTokenModal;