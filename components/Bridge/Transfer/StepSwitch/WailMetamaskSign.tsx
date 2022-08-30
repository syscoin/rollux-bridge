import { useTransfer } from "@contexts/Transfer/useTransfer";
import { Alert, AlertColor, Button } from "@mui/material";

const WaitMetaMaskSign = () => {
  const { retry, error } = useTransfer();
  let alertColor: AlertColor = "info";
  let message = "Check Metmask Wallet for signing";
  if (error) {
    alertColor = "error";
    if (typeof error === "string") {
      message = error;
    }
  }

  return (
    <Alert
      severity={alertColor}
      action={
        <Button color="inherit" size="small" onClick={() => retry()}>
          Retry
        </Button>
      }
    >
      {message}
    </Alert>
  );
};

export default WaitMetaMaskSign;
