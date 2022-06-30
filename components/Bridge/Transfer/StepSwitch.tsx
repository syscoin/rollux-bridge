import { useConnectedWallet } from "@contexts/ConnectedWallet/useConnectedWallet";
import { PriorityHigh } from "@mui/icons-material";
import { Alert, Button, Card, CardContent, Typography } from "@mui/material";
import { useTransfer } from "contexts/Transfer/useTransfer";
import BridgeTransferComplete from "./Complete";
import BridgeTransferForm from "./Form";

const BridgeTransferStepSwitch: React.FC = () => {
  const {
    transfer: { status, utxoAddress },
    error,
    retry,
  } = useTransfer();

  const { utxo, connectUTXO } = useConnectedWallet();

  if (status === "initialize") {
    return <BridgeTransferForm />;
  }

  if (["burn-sys", "burn-sysx", "mint-sysx"].includes(status)) {
    if (!utxo.account || utxoAddress !== utxo.account) {
      return (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => connectUTXO("pali-wallet")}
            >
              Reconnect
            </Button>
          }
        >
          {!utxo.account ? "Reconnect Pali wallet" : `Change to ${utxoAddress}`}
        </Alert>
      );
    }
    return (
      <Alert
        severity={error ? "error" : "warning"}
        action={
          <Button color="inherit" size="small" onClick={() => retry()}>
            Retry
          </Button>
        }
      >
        {error ?? "Check Pali Wallet for signing"}
      </Alert>
    );
  }

  if (status === "generate-proofs") {
    return (
      <Alert
        severity="warning"
        action={
          <Button color="inherit" size="small" onClick={() => retry()}>
            Retry
          </Button>
        }
      >
        Check Pali Wallet for transaction confirmations
      </Alert>
    );
  }
  if (["submit-proofs", "freeze-burn-sys"].includes(status)) {
    return (
      <Alert
        severity="warning"
        action={
          <Button color="inherit" size="small" onClick={() => retry()}>
            Retry
          </Button>
        }
      >
        Check Metmask Wallet for signing
      </Alert>
    );
  }
  if (status === "confirm-freeze-burn-sys") {
    return (
      <Alert
        severity="warning"
        action={
          <Button color="inherit" size="small" onClick={() => retry()}>
            Retry
          </Button>
        }
      >
        Check Metamask for transaction confirmations
      </Alert>
    );
  }
  if (status === "completed") {
    return <BridgeTransferComplete />;
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="body2">
          <PriorityHigh color="warning" />
          Check Pali Wallet for signing
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BridgeTransferStepSwitch;
