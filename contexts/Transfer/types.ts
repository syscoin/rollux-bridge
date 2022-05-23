export type TransferType = "sys-to-nevm" | "nevm-to-sys";

export type SysToEthTransferStatus =
  | "initialize"
  | "burn-sys"
  | "burn-sysx"
  | "generate-proofs"
  | "submit-proofs"
  | "completed"
  | "error";

export type TransferStatus = SysToEthTransferStatus;

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
}
