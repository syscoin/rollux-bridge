import { useMemo, useEffect } from "react"

export const useComputeNFTImageUrl = ({ url }: { url: string | null }): string => {
    return useMemo(() => {
        if (null === url || String(url ?? '').length < 10) {
            return '';
        }

        if (url.startsWith('ipfs://')) {
            const ipfsGatewayUrl = 'https://ipfs.io/ipfs/';
            const ipfsHash = url.split('ipfs://')[1];
            const ipfsUrl = ipfsGatewayUrl + ipfsHash

            return ipfsUrl;
        }

        return url;
    }, [url])
}