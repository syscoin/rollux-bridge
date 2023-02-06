import { useState, useEffect } from 'react'

type TokenInfo = {
    address: string,
    symbol: string,
    fullName: string,
    decimals: number,
    iconPath: string,
}

export const useERC20TokenList = (filterName: string = '') => {
    const [tokens, setTokens] = useState<TokenInfo[]>([]);
    const [retTokens, setRetTokens] = useState<TokenInfo[]>([]);


    useEffect(() => {
        /**
         * 
         * Just populate with hardcoded tokens
         */


        const tmpTokens: TokenInfo[] = [];

        tmpTokens.push({
            address: '0x0000000000000000000000000000000000000000',
            symbol: 'TEST',
            fullName: 'Test Token',
            decimals: 18,
            iconPath: '/icon.png'
        })

        setTokens(tmpTokens);
        setRetTokens(tmpTokens);
    }, []);

    useEffect(() => {
        if (tokens.length > 0) {
            setRetTokens(tokens.filter((value: TokenInfo) => {
                if (value.symbol.includes(filterName) || value.fullName.includes(filterName)) {
                    return value;
                }
            }) ?? []);
        }

    }, [filterName, tokens]);


    return retTokens;

}