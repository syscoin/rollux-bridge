export type TransferType = "sys-to-nevm" | "nevm-to-sys";

export type TransferStatus = "pending" | "success" | "failed";

export interface ITransferLog {
  type: string;
  payload: any;
}

export interface ITransfer {
  id: string;
  type: TransferType;
  status: TransferStatus;
  amount: string;
  logs: ITransferLog[];
}
