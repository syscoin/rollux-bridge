import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    amountToSwap: '',
}

const Withdrawals = createSlice({
    name: "Withdrawals",
    initialState,
    reducers: {
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
    setAmountToSwap
} = Withdrawals.actions;

export default Withdrawals.reducer;