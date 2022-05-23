import { ITransfer, TransferStatus, TransferType } from "../types";

export const setType = (
  transferType: TransferType
): {
  type: "set-type";
  payload: TransferType;
} => ({
  type: "set-type",
  payload: transferType,
});

export const setAmount = (
  amount: string
): {
  type: "set-amount";
  payload: string;
} => ({
  type: "set-amount",
  payload: amount,
});

export const addLog = (
  nextStatus: TransferStatus,
  message: string,
  data: any
): {
  type: "add-log";
  payload: { nextStatus: TransferStatus; message: string; data: any };
} => ({
  type: "add-log",
  payload: {
    nextStatus,
    message,
    data,
  },
});

export const setStatus = (
  status: TransferStatus
): { type: "set-status"; payload: TransferStatus } => ({
  type: "set-status",
  payload: status,
});

export const initialize = (
  transfer: ITransfer
): { type: "initialize"; payload: ITransfer } => ({
  type: "initialize",
  payload: transfer,
});

export type TransferActions =
  | ReturnType<typeof setType>
  | ReturnType<typeof setAmount>
  | ReturnType<typeof addLog>
  | ReturnType<typeof setStatus>
  | ReturnType<typeof initialize>;
