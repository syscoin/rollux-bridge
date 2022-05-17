export type UTXOWallet = "pali-wallet";

export type NEVMWallet = "metamask";

export interface UTXOInfo {
  type: UTXOWallet;
  account: string;
}

export interface NEVMInfo {
  type: NEVMWallet;
  account: string;
}
