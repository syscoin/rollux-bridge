import { PriorityHigh, Refresh, RefreshOutlined } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useTransfer } from "contexts/Transfer/useTransfer";
import BridgeTransferComplete from "./Complete";
import BridgeSysToSysxForm from "./SysToSysxForm";

const BridgeTransferStepSwitch: React.FC = () => {
  const {
    transfer: { status },
    retry,
  } = useTransfer();

  if (status === "initialize") {
    return <BridgeSysToSysxForm />;
  }

  if (status === "burn-sys" || status === "burn-sysx") {
    return (
      <Alert
        severity="warning"
        action={
          <Button color="inherit" size="small" onClick={() => retry()}>
            Retry
          </Button>
        }
      >
        Check Pali Wallet for signing
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
  if (status === "submit-proofs") {
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
