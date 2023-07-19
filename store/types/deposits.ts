export enum TxStatus {
    CONFIRMATION = "CONFIRMATION",
    REVERTED = "REVERTED",
    CONFIRMED = "CONFIRMED"
}

export type Deposit = {
    amount: number,
    txHash: string,
    txStatus: TxStatus,
    token: string,
}