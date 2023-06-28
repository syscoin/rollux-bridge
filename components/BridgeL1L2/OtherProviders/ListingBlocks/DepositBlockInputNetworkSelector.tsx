import { Box, HStack, Text } from "@chakra-ui/react";
import React, { FC, useState, useEffect } from "react";
import { OtherProvidersMenuSelector } from "../OtherProvidersMenuSelector";
import { getKeyValue } from "blockchain/NevmRolluxBridge/bridgeProviders/helpers";

export type DepositBlockInputNetworkSelectorProps = {
    preSelectedNetwork: string,
    onInputNetworkChange: (network: string) => void,
}

export const DepositBlockInputNetworkSelector: FC<DepositBlockInputNetworkSelectorProps> = ({ onInputNetworkChange, preSelectedNetwork }) => {
    const [network, setNetwork] = useState<string>(preSelectedNetwork);

    useEffect(() => {
        onInputNetworkChange(network);
    }, [network, onInputNetworkChange]);

    return (<>
        <Box
            sx={{
                backgroundColor: 'brand.lightPrimary',
                borderRadius: '4px',
                p: 3
            }}
        >
            <HStack ml={1} mb={2}>
                <OtherProvidersMenuSelector preSelectLabel={'From'} onSelect={setNetwork} preSelectedNetwork={preSelectedNetwork} />
            </HStack>
            <HStack ml={1} mb={2}>
                <Text fontSize={'sm'} color={'gray.700'}>To move tokens from {getKeyValue(network)} to Rollux you can use one of the following third-party bridges.</Text>
            </HStack>
            <HStack ml={1} mb={2}>
                <Text fontSize={'sm'} color={'gray.700'}>Please note that these are independent service providers that Rollux is linking to for your convenience - Rollux has no responsibility for their operation.</Text>
            </HStack>
        </Box>

    </>)
}