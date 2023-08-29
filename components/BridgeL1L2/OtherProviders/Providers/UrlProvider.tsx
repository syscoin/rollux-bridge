import { useEthers } from "@usedapp/core";
import { OtherBridgeComponentBaseProps } from "blockchain/NevmRolluxBridge/bridgeProviders/types"
import React, { FC } from "react"
import { ProviderCard } from "../ProviderCard";


export const UrlProvider: FC<OtherBridgeComponentBaseProps> = ({
    bridgeDetails,
    mode,
    payload,

}) => {
    const { account } = useEthers();

    const handleOpenBridge = () => {

        if (!account) {
            console.warn('No account connected');
            return;
        }

        let _url = `https://${bridgeDetails.urlProviderDestination || bridgeDetails.url || 'rollux.com'}`;

        window.open(_url, '_blank');
    };

    return (<>
        <ProviderCard
            config={bridgeDetails}
            onButtonClick={handleOpenBridge}
        />
    </>);
}

export default UrlProvider;