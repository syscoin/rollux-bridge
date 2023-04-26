import { useMemo, useEffect, useState } from 'react';
import useSWR from 'swr'

export type useNFTTokenlistProps = {
    queryToken: string,
    atChainId: number | undefined,
}

const _tokenlistUrl = 'https://syscoin.github.io/syscoin-rollux.github.io/nft.tokenlist.json';

export type NFTToken = {
    name: string,
    chainId: number,
    address: string,
    standard: "erc721" | "erc1155",
    symbol: string,
    logoURI: string,
    bridgedTo: string
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

export const useNFTTokenlist = (props: useNFTTokenlistProps): { oppositeLayerToken: NFTToken | undefined } => {
    const { data, error } = useSWR(_tokenlistUrl, fetcher);

    const [allTokens, setAllTokens] = useState<NFTToken[]>([])
    const [selectedToken, setSelectedToken] = useState<NFTToken | undefined>(undefined);

    useEffect(() => {
        if (!error) {
            console.log(data);
            setAllTokens(data.tokens)
        }
    }, [data, error])

    useEffect(() => {

        if (!props.atChainId) {
            setSelectedToken(undefined)
            return; // break if no chain id
        }

        const tokenInfo: NFTToken | undefined = allTokens.find((value) => {
            if (value.address === props.queryToken && value.chainId === props.atChainId) {
                return true;
            }
            return false;
        })

        if (tokenInfo) {
            setSelectedToken(tokenInfo);
        } else {
            setSelectedToken(undefined);
        }
    }, [props.atChainId, props.queryToken, allTokens])

    return useMemo(() => {
        return {
            oppositeLayerToken: selectedToken
        }
    }, [selectedToken])

}