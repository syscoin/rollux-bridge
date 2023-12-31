import { createSlice } from "@reduxjs/toolkit";
import { Deposit } from "store/types/deposits";

export const initialState = {
    deposits: [] as Deposit[],
    amountToSwap: '',
}

const Deposits = createSlice({
    name: "Deposits",
    initialState,
    reducers: {
        addDeposit: (state, action) => {
            state.deposits.push(action.payload);
        },
        setAmountToSwap: (state, action) => {
            state = {
                ...state,
                amountToSwap: action.payload
            }

            return state;
        }
    }
});

export const {
    addDeposit,
    setAmountToSwap
} = Deposits.actions;

export default Deposits.reducer;