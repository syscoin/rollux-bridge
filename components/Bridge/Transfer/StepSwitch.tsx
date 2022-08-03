import { useConnectedWallet } from "@contexts/ConnectedWallet/useConnectedWallet";
import { Alert, Button, Typography } from "@mui/material";
import { useTransfer } from "contexts/Transfer/useTransfer";
import BridgeTransferComplete from "./Complete";
import BridgeTransferForm from "./Form";
import WaitMetaMaskSign from "./StepSwitch/WailMetamaskSign";
import WaitMetamaskTransactionConfirmation from "./StepSwitch/WaitMetamaskTransactionConfirmation";
import WaitForPaliWalletSign from "./StepSwitch/WaitPaliWalletSign";
import WaitPaliWalletTransactionConfirmation from "./StepSwitch/WaitPaliwalletTransactionConfirmation";

const BridgeTransferStepSwitch: React.FC = () => {
  const {
    transfer: { status, logs },
    revertToPreviousStatus,
  } = useTransfer();

  if (status === "initialize") {
    return <BridgeTransferForm />;
  }

  if (["burn-sys", "burn-sysx", "mint-sysx"].includes(status)) {
    return <WaitForPaliWalletSign />;
  }

  if (
    [
      "confirm-burn-sys",
      "confirm-burn-sysx",
      "confirm-mint-sysx",
      "generate-proofs",
    ].includes(status)
  ) {
    return <WaitPaliWalletTransactionConfirmation />;
  }
  if (["submit-proofs", "freeze-burn-sys"].includes(status)) {
    return <WaitMetaMaskSign />;
  }
  if (status === "confirm-freeze-burn-sys") {
    return <WaitMetamaskTransactionConfirmation />;
  }
  if (["completed", "finalizing"].includes(status)) {
    return <BridgeTransferComplete isComplete={status === "completed"} />;
  }

  const lastLog = logs[logs.length - 1];
  if (!lastLog) {
    return null;
  }
  const { message } = lastLog.payload;

  return (
    <Alert
      severity="error"
      action={
        <Button
          color="inherit"
          size="small"
          onClick={() => revertToPreviousStatus()}
        >
          Retry
        </Button>
      }
    >
      <Typography variant="body2" color="error">
        {message}
      </Typography>
    </Alert>
  );
};

export default BridgeTransferStepSwitch;
