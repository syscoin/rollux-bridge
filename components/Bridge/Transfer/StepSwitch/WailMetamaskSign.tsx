import { useTransfer } from "@contexts/Transfer/useTransfer";
import { Alert, Button } from "@mui/material";

const WaitMetaMaskSign = () => {
  const { retry } = useTransfer();

  return (
    <Alert
      severity="info"
      action={
        <Button color="inherit" size="small" onClick={() => retry()}>
          Retry
        </Button>
      }
    >
      Check Metmask Wallet for signing
    </Alert>
  );
};

export default WaitMetaMaskSign;
