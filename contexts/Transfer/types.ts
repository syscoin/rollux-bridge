export type TransferType = "sys-to-nevm" | "nevm-to-sys";

export type SysToEthTransferStatus =
  | "initialize"
  | "burn-sys"
  | "burn-sysx"
  | "generate-proofs"
  | "submit-proofs"
  | "completed"
  | "error";

export type EthToSysTransferStatus =
  | "initialize"
  | "freeze-burn-sys"
  | "confirm-freeze-burn-sys"
  | "mint-sysx"
  | "burn-sysx"
  | "error"
  | "completed";

export type TransferStatus = SysToEthTransferStatus | EthToSysTransferStatus;

export interface ITransferLog<T = any> {
  status: TransferStatus;
  payload: {
    message: string;
    data: T;
  };
}

export interface ITransfer {
  id: string;
  type: TransferType;
  status: TransferStatus;
  amount: string;
  logs: ITransferLog[];
  createdAt: number;
  updatedAt?: number;
  utxoAddress: string;
  nevmAddress: string;
}
