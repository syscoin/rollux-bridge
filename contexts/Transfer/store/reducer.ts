import { Reducer } from "react";
import { ITransfer } from "../types";
import { TransferActions } from "./actions";

export const reducer: Reducer<ITransfer, TransferActions> = (state, action) => {
  switch (action.type) {
    case "set-type":
      return { ...state, type: action.payload, updatedAt: Date.now() };

    case "set-amount":
      return { ...state, amount: action.payload, updatedAt: Date.now() };

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
              previousStatus: state.status,
            },
          },
        ],
        updatedAt: Date.now(),
      };

    case "set-status":
      return { ...state, status: action.payload, updatedAt: Date.now() };

    case "initialize": {
      return action.payload;
    }
    case "setUtxoAddress": {
      return { ...state, utxoAddress: action.payload, updatedAt: Date.now() };
    }
    case "setNevmAddress": {
      return { ...state, nevmAddress: action.payload, updatedAt: Date.now() };
    }
    default:
      return state;
  }
};

export default reducer;
