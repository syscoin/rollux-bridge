import { CurrentDisplayView } from "components/BridgeL1L2/interfaces";
import { OtherProviderBridgeMode } from "components/BridgeL1L2/OtherProviders/types";
import { providers } from "./providers";
import { useState, useEffect, useMemo } from "react";
import { BridgedNetwork, FiatOrBridged, OtherBridgeProvider } from "./types";
import { getKeyValue } from "./helpers";

export const useOtherProviders = (
    mode: CurrentDisplayView,
    selectedCurrency: FiatOrBridged
) => {
    const [all, setAll] = useState<OtherBridgeProvider[]>([]);

    useEffect(() => {
        setAll([...providers])
        // console.log("providers", providers)
    }, []);

    useEffect(() => { console.log(mode, selectedCurrency) }, [mode, selectedCurrency])

    return useMemo(() => {
        return all.filter(provider => {
            if (mode === CurrentDisplayView.deposit) {

                let items = provider.supportsDeposits && Object.values(provider.supportedInputs).includes(
                    // @ts-ignore
                    getKeyValue(String(selectedCurrency))
                );
                return items;
            } else if (mode === CurrentDisplayView.withdraw) {
                let items = provider.supportsWithdrawals && Object.values(provider.supportedOutputs).includes(
                    // @ts-ignore
                    getKeyValue(String(selectedCurrency))
                )

                return items;
            } else {
                return false;
            }
        }
        )
    }, [mode, selectedCurrency, all])
}

export default useOtherProviders;