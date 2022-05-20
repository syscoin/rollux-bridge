import { TransferType } from "../types";

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

export type TransferActions =
  | ReturnType<typeof setType>
  | ReturnType<typeof setAmount>;
