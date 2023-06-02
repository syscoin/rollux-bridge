import { CurrentDisplayView } from "components/BridgeL1L2/interfaces";
import { OtherProviderBridgeMode } from "components/BridgeL1L2/OtherProviders/types";
import { providers } from "./providers";
import { useState, useEffect, useMemo } from "react";
import { OtherBridgeProvider } from "./types";


export const useOtherProviders = (
    mode: CurrentDisplayView,
    bridgeMode: OtherProviderBridgeMode
) => {
    const [all, setAll] = useState<OtherBridgeProvider[]>([]);

    useEffect(() => {
        setAll([...providers])
    }, []);

    return useMemo(() => {
        return all.filter((value, index) => {
            if (value.enabled === false) return false;

            if (mode === CurrentDisplayView.deposit
                && value.supportsDeposits
            ) {
                return true;
            }

            if (mode === CurrentDisplayView.withdraw
                && value.supportsWithdrawals
            ) {
                return true;
            }
        }).filter((value) => {
            if (bridgeMode === OtherProviderBridgeMode.crypto &&
                value.supportsCrypto === true
            ) {
                return true;
            }

            if (bridgeMode === OtherProviderBridgeMode.fiat &&
                value.supportsFiat === true
            ) {
                return true;
            }
        })
    }, [mode, bridgeMode, all])
}

export default useOtherProviders;