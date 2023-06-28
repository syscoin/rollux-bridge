import { Box } from "@chakra-ui/react";
import { OtherBridgeComponentBaseProps } from "blockchain/NevmRolluxBridge/bridgeProviders/types";
import React, { FC } from "react";
import { ProviderCard } from "../ProviderCard";

export const ChaingeProvider: FC<OtherBridgeComponentBaseProps> = ({
    bridgeDetails,
    mode,
    payload,
}) => {

    const handleButtonClick = () => {
        const fromChain = payload.direction === 'deposit' ? payload.inputNetwork : 'ROLLUX';
        const toChain = payload.direction === 'deposit' ? 'ROLLUX' : payload.inputNetwork;
        const fromToken = payload.token.symbol;
        const toToken = payload.token.symbol;

        const baseUrl = `https://dapp.chainge.finance/?fromChain=${fromChain}&toChain=${toChain}&fromToken=${fromToken}&toToken=${toToken}`;

        console.log(baseUrl);

        window.open(baseUrl, '_blank');
    };

    return (
        <Box minW={'100%'}>
            <ProviderCard
                config={bridgeDetails}
                onButtonClick={handleButtonClick}
            />
        </Box>
    );
}
