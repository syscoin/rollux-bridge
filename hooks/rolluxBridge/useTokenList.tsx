import TokenListToken from "blockchain/NevmRolluxBridge/interfaces/TokenListToken";
import { useEffect, useState } from "react";
import { tokenListAddress } from "blockchain/NevmRolluxBridge/config/http";

const getTokenList = async () => {
    const response = await fetch(tokenListAddress);
    const json = await response.json();
    return json.tokens;
}

export const useTokenList = (chainId: number) => {
    const [tokenList, setTokenList] = useState<TokenListToken[]>([]);
    const [filteredTokenList, setFilteredTokenList] = useState<TokenListToken[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        const fetchTokenList = async () => {
            const _tokenList = await getTokenList();
            setTokenList(_tokenList.filter((token: { symbol: string; }) => token.symbol !== 'SYS'));
            setFilteredTokenList(tokenList.filter((token: { chainId: number; }) => token.chainId === chainId));
            setLoading(false);
        }
        fetchTokenList();
    }, [chainId]);

    return { tokenList, filteredTokenList, loading };
}