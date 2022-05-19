import { TransferType } from "../types";

export const SetType = (type: TransferType) => ({
  type: "set-type",
  payload: {
    type,
  },
});

export const SetAmount = (amount: string) => ({
  type: "set-amount",
  payload: {
    amount,
  },
});

export type TransferActions =
  | ReturnType<typeof SetType>
  | ReturnType<typeof SetAmount>;
