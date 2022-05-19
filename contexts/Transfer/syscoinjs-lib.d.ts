declare module "syscoinjs-lib" {
  declare module syscoin {
    export function assetAllocationBurn(
      txOpts,
      assetMap,
      sysChangeAddress,
      feeRate,
      sysFromXpubOrAddress,
      utxos,
      redeemOrWitnessScript?
    ): Promise<{ psbt; assets }>;
  }
  declare module utils {
    export function exportPsbtToJson(psbt: Psbt, assets): { psbt; assets };
    export function importPsbtFromJson(jsonData, network): { psbt; assets };
  }
}

declare module "satoshi-bitcoin" {
  export function toSatoshi(amount: number | string): number;
  export function toBitcoin(amount: number | string): number;
}
