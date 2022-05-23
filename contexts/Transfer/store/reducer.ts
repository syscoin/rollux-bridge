import { Reducer } from "react";
import { ITransfer } from "../types";
import { TransferActions } from "./actions";

export const reducer: Reducer<ITransfer, TransferActions> = (state, action) => {
  switch (action.type) {
    case "set-type":
      return { ...state, type: action.payload };

    case "set-amount":
      return { ...state, amount: action.payload };

    case "add-log":
      const { data, message, nextStatus } = action.payload;
      return {
        ...state,
        logs: [
          ...state.logs,
          {
            status: nextStatus,
            payload: {
              data,
              message,
            },
          },
        ],
      };

    case "set-status":
      return { ...state, status: action.payload };
    default:
      return state;
  }
};

export default reducer;
