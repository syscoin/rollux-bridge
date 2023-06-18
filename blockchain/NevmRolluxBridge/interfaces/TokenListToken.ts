export interface TokenListToken {
    chainId: number,
    address: string,
    name: string,
    symbol: string,
    decimals: number,
    logoURI: string,
    extensions: {
        rolluxBridgeAddress?: string,
    }
}

export default TokenListToken;