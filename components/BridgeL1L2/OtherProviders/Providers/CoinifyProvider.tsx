import { OtherBridgeComponentBaseProps } from "blockchain/NevmRolluxBridge/bridgeProviders/types"
import React, { FC } from "react"
import { ProviderCard } from "../ProviderCard";

export const CoinifyProvider: FC<OtherBridgeComponentBaseProps> = ({
    bridgeDetails,
    mode,
    payload,

}) => {
    return (<>
        <ProviderCard
            config={bridgeDetails}
            onButtonClick={() => console.log('click')}
        />
    </>);
}