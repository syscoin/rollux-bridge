import { Button, HStack, Image, Text } from "@chakra-ui/react";
import TokenListToken from "blockchain/NevmRolluxBridge/interfaces/TokenListToken";
import React, { FC } from "react";

export type SelectTokenBadgeProps = {
    token: { address: string, chainId: number, decimals: number, name: string, symbol: string, logoURI: string };
    onSelect: (token: { address: string, chainId: number, decimals: number, name: string, symbol: string, logoURI: string }) => void;
}

export const SelectTokenBadge: FC<SelectTokenBadgeProps> = ({ token, onSelect }) => {
    return (
        <Button
            variant={'outline'}
            borderRadius={'md'}
            onClick={() => onSelect(token)}
        >
            <HStack>
                <Image
                    borderRadius="full"
                    src={token.logoURI}
                    alt={`${token.name} logo`}
                    boxSize="6"
                />

                <Text>{token.symbol}</Text>
            </HStack>
        </Button>
    )
}

export default SelectTokenBadge;