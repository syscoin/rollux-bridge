import tokenListAddress from "../config/http";
import TokenListToken from "../interfaces/TokenListToken";

export const fetchERC20TokenList = async (): Promise<TokenListToken[]> => {
    const jsonFetch = await fetch(tokenListAddress);
    const body = await jsonFetch.json();

    return body.tokens.map((item: {}) => {
        return item as TokenListToken;
    })
}