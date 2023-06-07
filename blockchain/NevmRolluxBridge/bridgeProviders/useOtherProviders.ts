import { CurrentDisplayView } from "components/BridgeL1L2/interfaces";
import { OtherProviderBridgeMode } from "components/BridgeL1L2/OtherProviders/types";
import { providers } from "./providers";
import { useState, useEffect, useMemo } from "react";
import { FiatOrBridged, OtherBridgeProvider } from "./types";


export const useOtherProviders = (
    mode: CurrentDisplayView,
    selectedCurrency: FiatOrBridged
) => {
    const [all, setAll] = useState<OtherBridgeProvider[]>([]);

    useEffect(() => {
        setAll([...providers])
        console.log("providers", providers)
    }, []);

    useEffect(() => { console.log(mode, selectedCurrency) }, [mode, selectedCurrency])

    return useMemo(() => {
        return all.filter(provider => {
            if (mode === CurrentDisplayView.deposit) {
                return provider.supportsDeposits && provider.supportedInputs.includes(selectedCurrency)
            } else if (mode === CurrentDisplayView.withdraw) {
                return provider.supportsWithdrawals && provider.supportedOutputs.includes(selectedCurrency)
            } else {
                return false;
            }
        }
        )
    }, [mode, selectedCurrency, all])
}

export default useOtherProviders;