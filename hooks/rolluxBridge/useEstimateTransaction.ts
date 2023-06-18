
import { BigNumber, ethers } from "ethers";
import { useMemo } from "react";
import { useCrossChainMessenger } from "./useCrossChainMessenger";
import useSWR from "swr";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then(res => res.json())

export const useEstimateTransaction = () => {
    const messenger = useCrossChainMessenger();

    const { data, error, isLoading } = useSWR('https://api.coingecko.com/api/v3/simple/price?ids=syscoin&vs_currencies=usd', fetcher)

    return useMemo(() => {

        const calculateEstimate = async (
            gasLimit: BigNumber,
            layer: number
        ) => {

            if (undefined === messenger) {
                console.warn("Messenger not initialized");
                return undefined;
            }

            if (!data || error || isLoading) {
                console.warn("Error fetching data from coingecko");
                return undefined;
            }


            const provider = layer === 1 ? messenger.l1Provider : messenger.l2Provider;
            const gasPrice = await provider.getGasPrice();

            const estimateInMainCurrency = ethers.utils.formatEther(gasLimit.mul(gasPrice));


            return {
                weiEstimate: parseFloat(estimateInMainCurrency),
                usdEstimate: parseFloat(estimateInMainCurrency) * data.syscoin.usd
            };

        }

        return {
            calculateEstimate
        }
    }, [messenger, data, error, isLoading]);
}