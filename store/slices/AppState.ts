import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isPendingDepositTx: false,
    isPendingWithdrawTx: false,
    isDepositTxRejected: false,
    isWithdrawTxRejected: false,
    isDepositTxSent: false,
    isWithdrawTxSent: false,
}

const AppState = createSlice({
    name: "AppState",
    initialState,
    reducers: {
        setIsPendingDepositTx: (state, action) => {
            console.log(state, action);
            state.isPendingDepositTx = action.payload;
        },
        setIsPendingWithdrawTx: (state, action) => {
            state.isPendingWithdrawTx = action.payload;
        },
        setIsDepositTxRejected: (state, action) => {
            state.isDepositTxRejected = action.payload;
        },
        setIsWithdrawTxRejected: (state, action) => {
            state.isWithdrawTxRejected = action.payload;
        },
        setIsDepositTxSent: (state, action) => {
            state.isDepositTxSent = action.payload;
        },
        setIsWithdrawTxSent: (state, action) => {
            state.isWithdrawTxSent = action.payload;
        },
        resetAll: (state) => {
            Object.assign(state, initialState);
        },
        resetAllErrors: (state) => {
            state.isDepositTxRejected = false;
            state.isWithdrawTxRejected = false;
        },
    }
});

export const {
    setIsPendingDepositTx,
    setIsPendingWithdrawTx,
    setIsDepositTxRejected,
    setIsWithdrawTxRejected,
    setIsDepositTxSent,
    setIsWithdrawTxSent,
    resetAll,
    resetAllErrors
} = AppState.actions;

export default AppState.reducer;