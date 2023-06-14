import React, { FC } from "react"
import { Button, Image, Text, HStack, Box, Spacer } from "@chakra-ui/react"
import { useEtherBalance, useEthers, useTokenBalance } from "@usedapp/core"
import { ethers } from "ethers"
import { Check } from "@mui/icons-material"
import { CheckIcon } from "@chakra-ui/icons"

export type SelectTokenModalItemProps = {
    chainId: number,
    address: string,
    symbol: string,
    name: string,
    decimals: number,
    logoURI: string,
    selected: boolean,
    onSelect: (token: { address: string, chainId: number, decimals: number, name: string, symbol: string, logoURI: string }) => void,
}

export const SelectTokenModalItem: FC<SelectTokenModalItemProps> = ({ chainId, address, symbol, name, logoURI, onSelect, decimals, selected }) => {

    const { account } = useEthers();

    const balanceToken = useTokenBalance(address, account, {
        chainId: chainId,
    });

    const balanceMainCurrency = useEtherBalance(account, {
        chainId: chainId,
    })

    return (
        <Box
            borderRadius={'md'}
            border={'1px solid'}
            borderColor={selected ? 'green.400' : 'gray.200'}
            p={2}
            maxH={'75px'}
            height={'fit-content'}
            cursor={'pointer'}
            mb={2}
            boxShadow={'md'}
            _hover={{
                borderColor: 'green.400',
                boxShadow: 'lg',
                transform: 'scale(1.03)',
            }}
            onClick={() => {
                onSelect({ chainId, address, symbol, name, logoURI, decimals });
            }}
            minW={'100%'}
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
    )

}

export default SelectTokenModalItem;