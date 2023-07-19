import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "store";
import { Deposit } from "store/types/deposits";

const selectDeposits = (state: RootState) => state.rootReducer.Deposits.deposits;

export const selectPendingDeposits = createSelector(
    selectDeposits,
    (deposits: Deposit[]) => deposits.filter((deposit: Deposit) => deposit.txStatus === "CONFIRMATION")
);

export const selectConfirmedDeposits = createSelector(
    selectDeposits,
    (deposits: Deposit[]) => deposits.filter((deposit: Deposit) => deposit.txStatus === "CONFIRMED")
);

export const selectRevertedDeposits = createSelector(
    selectDeposits,
    (deposits: Deposit[]) => deposits.filter((deposit: Deposit) => deposit.txStatus === "REVERTED")
);

