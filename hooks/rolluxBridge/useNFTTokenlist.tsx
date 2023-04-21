import { useMemo, useEffect, useState } from 'react';
import useSWR from 'swr'

export type useNFTTokenlistProps = {
    queryToken: string,
    atChainId: number,
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

export const useNFTTokenlist = (props: useNFTTokenlistProps) => {
    const { data, error } = useSWR(_tokenlistUrl, fetcher);

    const [allTokens, setAllTokens] = useState<NFTToken[]>([])
    const [selectedToken, setSelectedToken] = useState<NFTToken | undefined>(undefined);

    useEffect(() => {
        if (!error) {
            setAllTokens(data.tokens)
        }
    }, [data, error])

    useEffect(() => {
        const tokenInfo: NFTToken | undefined = allTokens.find((value) => {
            if (value.address === props.queryToken && value.chainId === props.atChainId) {
                return true;
            }
            return false;
        })

        if (tokenInfo) {
            setSelectedToken(tokenInfo);
        }
    }, [props.atChainId, props.queryToken, allTokens])



}