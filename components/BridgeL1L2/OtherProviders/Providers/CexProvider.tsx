import React, { FC } from "react"
import { OtherBridgeComponentBaseProps } from "blockchain/NevmRolluxBridge/bridgeProviders/types";
import { ProviderCard } from "../ProviderCard";

export const CexProvider: FC<OtherBridgeComponentBaseProps> = ({
    bridgeDetails,
    mode,
    payload,
}) => {
    console.log(bridgeDetails, mode, payload);

    return (
        <ProviderCard
            config={bridgeDetails}
            onButtonClick={() => { }}
        />
    )
}