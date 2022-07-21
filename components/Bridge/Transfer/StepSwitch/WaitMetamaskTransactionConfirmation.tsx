import { useTransfer } from "@contexts/Transfer/useTransfer";
import { Alert, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

const WaitMetamaskTransactionConfirmation = () => {
  const { retry, error } = useTransfer();
  const [showRetry, setShowRetry] = useState(false);

  const retryMessage =
    typeof error === "string"
      ? error
      : "Check Metamask for transaction confirmations";

  useEffect(() => {
    setShowRetry(Boolean(error));
  }, [error]);

  return (
    <Alert
      severity={error ? "error" : "info"}
      action={
        showRetry && (
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

export default WaitMetamaskTransactionConfirmation;
