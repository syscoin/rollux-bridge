import { useAppDispatch } from "store";
import {
    setIsDepositTxRejected,
    setIsDepositTxSent,
    setIsPendingDepositTx,
    setIsPendingWithdrawTx,
    setIsWithdrawTxRejected,
    setIsWithdrawTxSent,
    resetAll,
    resetAllErrors
} from "store/slices/AppState";

export const useTxState = () => {
    const dispatch = useAppDispatch();

    return {
        setIsPendingDepositTx: (payload: boolean) => dispatch(setIsPendingDepositTx(payload)),
        setIsPendingWithdrawTx: (payload: boolean) => dispatch(setIsPendingWithdrawTx(payload)),
        setIsDepositTxRejected: (payload: boolean) => dispatch(setIsDepositTxRejected(payload)),
        setIsWithdrawTxRejected: (payload: boolean) => dispatch(setIsWithdrawTxRejected(payload)),
        setIsDepositTxSent: (payload: boolean) => dispatch(setIsDepositTxSent(payload)),
        setIsWithdrawTxSent: (payload: boolean) => dispatch(setIsWithdrawTxSent(payload)),
        resetAll: () => dispatch(resetAll()),
        resetAllErrors: () => dispatch(resetAllErrors())
    }
}

export default useTxState;