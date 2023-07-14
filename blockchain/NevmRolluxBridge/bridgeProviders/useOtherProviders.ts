import { CurrentDisplayView } from "components/BridgeL1L2/interfaces";
import { providers } from "./providers";
import { useState, useEffect, useMemo } from "react";
import { BridgedNetwork, FiatOrBridged, OtherBridgeProvider } from "./types";
import { getKeyValue, isCEXProvider } from "./helpers";

export const useOtherProviders = (
    mode: CurrentDisplayView,
    selectedCurrency: FiatOrBridged,
    selectedToken: {
        name: string,
        symbol: string,
        decimals: number,
        address: string,
        logoURI: string,
        chainId: number,
    }
) => {
    const [all, setAll] = useState<OtherBridgeProvider[]>([]);

    useEffect(() => {
        setAll([...providers])
        // console.log("providers", providers)
    }, []);

    return useMemo(() => {
        if (isCEXProvider(String(selectedCurrency))) {
            return all.filter(provider => {
                if (provider.code.toLowerCase() === String(selectedCurrency).toLowerCase()) {
                    return true;
                }
            });
        }


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
        ).filter(provider => {

            if (provider.supportsCrypto && provider.supportedTokens.includes(selectedToken.symbol)) {
                return true;
            }
            return false;
        });
    }, [mode, selectedCurrency, selectedToken, all])
}

export default useOtherProviders;