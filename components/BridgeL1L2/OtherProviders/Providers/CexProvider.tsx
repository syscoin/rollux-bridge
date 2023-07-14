import React, { FC } from "react"
import { OtherBridgeComponentBaseProps } from "blockchain/NevmRolluxBridge/bridgeProviders/types";
import { ProviderCard } from "../ProviderCard";

export const CexProvider: FC<OtherBridgeComponentBaseProps> = ({
    bridgeDetails,
    mode,
    payload,
}) => {


    return (
        <ProviderCard
            config={bridgeDetails}
            onButtonClick={() => {
                if (bridgeDetails.url) {
                    window.open(bridgeDetails.url, "_blank");
                }
            }}
        />
    )
}