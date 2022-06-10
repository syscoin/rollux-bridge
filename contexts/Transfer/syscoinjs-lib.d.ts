declare module "syscoinjs-lib" {
  interface SPVProof {
    transaction: string;
    blockhash: string;
    header: string;
    siblings: string[];
    index: number;
    nevm_blockhash: string;
    chainlock: boolean;
  }
  interface Network {
    messagePrefix: string;
    bech32: string;
    bip32: {
      public: number;
      private: number;
    };
    pubKeyHash: number;
    scriptHash: number;
    wif: number;
  }

  export interface UTXOTransaction {
    psbt: Psbt;
    assets: string;
  }

  class syscoin {
    constructor(p1, blockbookAPIURL: string, network: Network): syscoin;
    syscoinBurnToAssetAllocation(
      txOpts,
      assetMap,
      sysChangeAddress,
      feeRate,
      sysFromXpubOrAddress,
      redeemOrWitnessScript?
    ): Promise<{ psbt; assets }>;
    assetAllocationBurn(
      txOpts,
      assetMap,
      sysChangeAddress,
      feeRate,
      sysFromXpubOrAddress,
      utxos,
      redeemOrWitnessScript?
    ): Promise<{ psbt; assets }>;
    assetAllocationMint(
      assetOpts,
      txOpts,
      assetMap,
      sysChangeAddress,
      feeRate,
      sysFromXpubOrAddress,
      utxos = undefined,
      redeemOrWitnessScript = undefined
    ): Promise<{ psbt; assets }>;
  }
  declare module utils {
    export function exportPsbtToJson(psbt: Psbt, assets): UTXOTransaction;
    export function importPsbtFromJson(jsonData, network): UTXOTransaction;
    export function fetchBackendSPVProof(
      blockbookAPIURL: string,
      txId: string
    ): Promise<any>;

    export const syscoinNetworks: {
      mainnet: Network;
    };
  }
}

declare module "satoshi-bitcoin" {
  export function toSatoshi(amount: number | string): number;
  export function toBitcoin(amount: number | string): number;
}

declare module "bitcoin-proof" {
  export function getProof(
    txIds: string[],
    txIndex: number
  ): { txId: string; txIndex: number; sibling: string[] };
}
