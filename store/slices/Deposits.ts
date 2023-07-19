import { createSlice } from "@reduxjs/toolkit";
import { Deposit, TxStatus } from "store/types/deposits";

export const initialState = {
    deposits: [] as Deposit[],
}

const Deposits = createSlice({
    name: "Deposits",
    initialState,
    reducers: {
        addDeposit: (state, action) => {
            state.deposits.push(action.payload);
        }
    }
});

export const {
    addDeposit
} = Deposits.actions;

export default Deposits.reducer;