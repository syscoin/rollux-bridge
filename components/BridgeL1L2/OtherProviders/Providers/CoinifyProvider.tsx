import { useEthers } from "@usedapp/core";
import { OtherBridgeComponentBaseProps } from "blockchain/NevmRolluxBridge/bridgeProviders/types"
import { CurrentDisplayView } from "components/BridgeL1L2/interfaces";
import React, { FC } from "react"
import { ProviderCard } from "../ProviderCard";


const baseUrl = 'https://trade.coinify.com/syscoin?defaultCryptoCurrency=SYSROLLUX&cryptoCurrencies=SYSROLLUX,SYSEVM,SYS';

export const CoinifyProvider: FC<OtherBridgeComponentBaseProps> = ({
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

        let _url = baseUrl;

        _url += `&address=${account}`;

        if (mode === CurrentDisplayView.withdraw) {
            _url += `&targetPage=sell`;
        }
        else {
            _url += `&targetPage=buy`;
        }

        window.open(_url, '_blank');
    };

    return (<>
        <ProviderCard
            config={bridgeDetails}
            onButtonClick={handleOpenBridge}
        />
    </>);
}