import { useConnectedWallet } from "@contexts/ConnectedWallet/useConnectedWallet";
import { Alert, Button, AlertColor } from "@mui/material";
import { useTransfer } from "contexts/Transfer/useTransfer";

const WaitForPaliWalletSign = () => {
  const {
    error,
    retry,
    transfer: { utxoAddress },
  } = useTransfer();
  const { utxo, connectUTXO } = useConnectedWallet();

  let severity: AlertColor = "info";
  let message = "Check Pali Wallet for signing";
  let alertAction = "Retry";

  let handleAlertAction = () => {
    retry();
  };

  if (!utxo.xpub) {
    severity = "error";
    alertAction = "Reconnect";
    message = "Reconnect Pali wallet";
    handleAlertAction = () => connectUTXO("pali-wallet");
  } else if (utxoAddress !== utxo.xpub) {
    severity = "error";
    alertAction = "Reconnect";
    message = `Change to ${utxoAddress}`;
    handleAlertAction = () => connectUTXO("pali-wallet");
  } else if (error) {
    severity = "error";
    if (typeof error === "string") {
      message = error;
    }
  }

  return (
    <Alert
      severity={severity}
      action={
        <Button color="inherit" size="small" onClick={handleAlertAction}>
          {alertAction}
        </Button>
      }
    >
      {message}
    </Alert>
  );
};

export default WaitForPaliWalletSign;
