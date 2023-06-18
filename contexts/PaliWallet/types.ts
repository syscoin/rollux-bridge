export namespace PaliWallet {
  export interface WalletState {
    status: number;
    accounts: Account[];
    activeAccountId: number;
    activeNetwork: string;
    confirmingTransaction: boolean;
    creatingAsset: boolean;
    issuingAsset: boolean;
    issuingNFT: boolean;
    mintNFT: boolean;
    updatingAsset: boolean;
    transferringOwnership: boolean;
    changingNetwork: boolean;
    signingTransaction: boolean;
    signingPSBT: boolean;
    walletTokens: WalletToken[];
  }

  export interface Account {
    address: Address;
    balance: number;
    assets: any[];
    id: number;
    isTrezorWallet: boolean;
    label: string;
    transactions: Transaction[];
    xpub: string;
  }

  export interface Address {
    main: string;
  }

  export interface Transaction {
    txid: string;
    value: string;
    confirmations: number;
    fees: string;
    blockTime: number;
    tokenType: string;
  }

  export interface WalletToken {
    accountId: number;
    accountXpub: string;
    tokens: Record<"123456" | string, TokenState>;
    holdings: Holding[];
    mintedTokens: any[];
  }

  export interface Holding {
    balance: number;
    type: string;
    decimals: number;
    symbol: string;
    assetGuid: string;
    baseAssetID: string;
    childAssetID: null;
    NFTID: string;
    description: string;
  }

  export interface TokenState {
    balance: number;
    type: string;
    decimals: number;
    symbol: string;
    assetGuid: string;
  }
}
