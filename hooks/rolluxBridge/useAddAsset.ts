import { ethers } from "ethers";
import { useMemo } from "react"

export const useAddAsset = (onError: (error: any) => void, onSuccess: () => void) => {

    return useMemo(() => {
        return {
            addAsset: async (provider: ethers.providers.JsonRpcProvider, tokenDetails: {
                address: string,
                chainId: number,
                symbol: string,
                decimals: number,
                image: string,
            }) => {
                try {
                    await provider.send("wallet_watchAsset", {
                        // @ts-ignore
                        type: "ERC20",
                        options: {
                            address: tokenDetails.address,
                            symbol: tokenDetails.symbol,
                            decimals: tokenDetails.decimals,
                            chainId: tokenDetails.chainId,
                            image: tokenDetails.image,
                        },
                    });

                    onSuccess();
                } catch (error) {
                    console.log(error);
                    onError(error)
                }
            }
        }
    }, [onError, onSuccess]);
}

export default useAddAsset;