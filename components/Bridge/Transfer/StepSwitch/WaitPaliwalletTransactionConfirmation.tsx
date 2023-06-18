import { Alert, Button, CircularProgress } from "@mui/material";
import { useTransfer } from "contexts/Transfer/useTransfer";
import { useEffect, useState } from "react";

const WaitPaliWalletTransactionConfirmation = () => {
  const { retry, error } = useTransfer();
  const [showRetry, setShowRetry] = useState(false);
  const retryMessage =
    typeof error === "string"
      ? error
      : "Check Pali Wallet  for transaction confirmations";

  useEffect(() => {
    setShowRetry(Boolean(error));
  }, [error]);

  return (
    <Alert
      severity={error ? "error" : "info"}
      action={
        error && (
          <Button color="inherit" size="small" onClick={() => retry()}>
            Retry
          </Button>
        )
      }
    >
      {showRetry ? (
        retryMessage
      ) : (
        <>
          Waiting for transaction confirmations <CircularProgress size="1rem" />
        </>
      )}
    </Alert>
  );
};

export default WaitPaliWalletTransactionConfirmation;
