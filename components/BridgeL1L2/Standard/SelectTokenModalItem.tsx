import React, { FC } from "react"
import { Image, Text, HStack, Box, Spacer, Button, Icon, useToast } from "@chakra-ui/react"
import { useEtherBalance, useEthers, useTokenBalance } from "@usedapp/core"
import { ethers } from "ethers"
import { CheckIcon } from "@chakra-ui/icons"
import useAddAsset from "hooks/rolluxBridge/useAddAsset"
import { MdAddTask } from "react-icons/md"

export type SelectTokenModalItemProps = {
    chainId: number,
    address: string,
    symbol: string,
    name: string,
    decimals: number,
    logoURI: string,
    selected: boolean,
    disabledAdd?: boolean,
    onSelect: (token: { address: string, chainId: number, decimals: number, name: string, symbol: string, logoURI: string }) => void,
}

export const SelectTokenModalItem: FC<SelectTokenModalItemProps> = ({ chainId, address, symbol, name, logoURI, onSelect, decimals, selected, disabledAdd = false }) => {

    const { account, library } = useEthers();

    const balanceToken = useTokenBalance(address, account, {
        chainId: chainId,
    });

    const balanceMainCurrency = useEtherBalance(account, {
        chainId: chainId,
    })

    const toast = useToast();

    const { addAsset } = useAddAsset(
        (error: any) => {
            toast({
                title: 'Error adding asset',
                description: error.message || 'Unknown error',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        },
        () => {
            toast({
                title: 'Asset added',
                description: `${symbol} has been added to your wallet`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        }
    );

    const handleAddAsset = () => {
        if (!library) {
            return;
        }

        addAsset(library as ethers.providers.JsonRpcProvider, {
            address: address,
            chainId: chainId,
            symbol: symbol,
            image: logoURI,
            decimals: decimals,
        });
    }

    return (
        <HStack gap={0} spacing={0} w={'100%'}>
            <Box
                borderRadius={'md'}
                border={'1px solid'}
                borderColor={selected ? 'green.400' : 'gray.200'}
                p={2}
                maxH={'75px'}
                height={'fit-content'}
                cursor={'pointer'}

                boxShadow={'md'}
                _hover={{
                    borderColor: 'green.400',
                    boxShadow: 'lg',
                    transform: 'translate(0px, -2px) !important',
                }}
                onClick={() => {
                    onSelect({ chainId, address, symbol, name, logoURI, decimals });
                }}
                w={'100%'}
            >
                <HStack>
                    <Image
                        borderRadius="full"
                        src={logoURI}
                        alt={`${name} logo`}
                        boxSize="6"
                    />
                    <Text>{name}</Text>
                    <Text fontSize={'sm'}>{symbol}</Text>
                    <Spacer />
                    <Text>
                        {'SYS' === symbol ?

                            parseFloat(ethers.utils.formatEther(balanceMainCurrency ?? 0)).toFixed(4) :
                            parseFloat(ethers.utils.formatUnits(balanceToken ?? 0, decimals)).toFixed(4)
                        }
                    </Text>
                    {selected && <>
                        <CheckIcon color={'green.400'} />
                    </>}
                </HStack>
            </Box>
            <Spacer />
            <Box
                borderRadius={'md'}
                border={'1px solid'}
                borderColor={disabledAdd ? 'gray.400' : selected ? 'green.200' : 'gray.200'}
                p={2}
                ml={2}
                maxH={'75px'}
                height={'fit-content'}
                cursor={'pointer'}
                boxShadow={'md'}
                _hover={!disabledAdd ? {
                    borderColor: 'green.400',
                    boxShadow: 'lg',
                    transform: 'translate(0px, -2px) !important',
                } : {
                    borderColor: 'gray.400',
                }}
                onClick={() => {
                    if (disabledAdd) {
                        return;
                    }
                    handleAddAsset()
                }}

            >
                <Icon as={MdAddTask} color={disabledAdd ? 'gray.400' : 'green.400'} />
            </Box>
        </HStack>

    )

}

export default SelectTokenModalItem;