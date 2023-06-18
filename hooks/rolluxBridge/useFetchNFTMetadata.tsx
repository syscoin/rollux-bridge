import { useState, useMemo, useCallback } from 'react';
import axios from 'axios';

export type fetchNFTMetdataProps = {
    url: string,
}

export const useFetchNFTMetadata = ({ url }: fetchNFTMetdataProps): { [key: string]: string } | null => {
    const [metadata, setMetadata] = useState<{ [key: string]: string } | null>(null);

    useMemo(async () => {
        if (!url || url.length < 10) {
            setMetadata(null)

            return;
        }

        try {
            let metadataResponse;
            if (url.startsWith('ipfs://')) {
                const ipfsGatewayUrl = 'https://ipfs.io/ipfs/';
                const ipfsHash = url.split('ipfs://')[1];
                const ipfsUrl = ipfsGatewayUrl + ipfsHash;
                metadataResponse = await axios.get(ipfsUrl);
            } else {
                metadataResponse = await axios.get(url);
            }
            setMetadata(metadataResponse?.data ?? null);
        } catch (error) {
            console.error(`Error fetching NFT metadata: ${error}`);
            setMetadata(null);
        }
    }, [url]);

    return metadata;
};

export default useFetchNFTMetadata;
