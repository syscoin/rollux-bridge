import { ArrowForward } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Link,
  Typography,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

import { useTransfer } from "contexts/Transfer/useTransfer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useConnectedWallet } from "@contexts/ConnectedWallet/useConnectedWallet";
import { TransactionReceipt } from "web3-core";
import { utils } from "syscoinjs-lib";

const SYSCOIN_TX_BLOCKCHAIN_URL = "https://blockbook.elint.services/tx/";
const NEVM_TX_BLOCKCHAIN_URL = "https://explorer.syscoin.org/tx/";

type BridgeTransferCompleteProps = {
  isComplete: boolean;
};

const SysToNevmComplete: React.FC<BridgeTransferCompleteProps> = ({
  isComplete,
}) => {
  const {
    transfer: { logs },
  } = useTransfer();

  const burnSysTx = logs.find((log) => log.status === "burn-sys");
  const burnSysxTx = logs.find((log) => log.status === "burn-sysx");
  const submitProofsTx = logs.find((log) => log.status === "submit-proofs");

  return (
    <CardContent>
      {isComplete ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          Transfer complete!
        </Alert>
      ) : (
        <Alert severity="info" sx={{ mb: 3 }}>
          Confirming final transaction...
        </Alert>
      )}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">Burn Sys tx:</Typography>
        <Link
          href={`${SYSCOIN_TX_BLOCKCHAIN_URL}${burnSysTx?.payload.data.tx}`}
          target="_blank"
        >
          {burnSysTx?.payload.data.tx}
        </Link>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">Burn Sysx tx:</Typography>
        <Link
          href={`${SYSCOIN_TX_BLOCKCHAIN_URL}${burnSysxTx?.payload.data.tx}`}
          target="_blank"
        >
          {burnSysxTx?.payload.data.tx}
        </Link>
      </Box>
      <Box>
        <Typography variant="body2">Submit Proofs tx:</Typography>
        <Link
          href={`${NEVM_TX_BLOCKCHAIN_URL}${submitProofsTx?.payload.data.hash}`}
          target="_blank"
        >
          {submitProofsTx?.payload.data.hash}
        </Link>
      </Box>
    </CardContent>
  );
};

const NevmToSysComplete: React.FC<BridgeTransferCompleteProps> = ({
  isComplete,
}) => {
  const {
    transfer: { logs },
  } = useTransfer();
  const nevmBurnSys = logs.find(
    (log) => log.status === "confirm-freeze-burn-sys"
  );
  const mintSysx = logs.find((log) => log.status === "mint-sysx");
  const burnSysx = logs.find((log) => log.status === "burn-sysx");

  return (
    <CardContent>
      <Box sx={{ mb: 2 }}>
        {isComplete ? (
          <Alert severity="success" sx={{ mb: 3 }}>
            Transfer complete!
          </Alert>
        ) : (
          <Alert severity="info" sx={{ mb: 3 }}>
            Confirming final transaction...
          </Alert>
        )}
        <Typography variant="body2">Freeze Burn tx:</Typography>
        <Link
          href={`${NEVM_TX_BLOCKCHAIN_URL}${nevmBurnSys?.payload.data.transactionHash}`}
          target="_blank"
        >
          {nevmBurnSys?.payload.data.transactionHash}
        </Link>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">Mint Sysx tx:</Typography>
        <Link
          href={`${SYSCOIN_TX_BLOCKCHAIN_URL}${mintSysx?.payload.data.tx}`}
          target="_blank"
        >
          {mintSysx?.payload.data.tx}
        </Link>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">Burn Sysx tx:</Typography>
        <Link
          href={`${SYSCOIN_TX_BLOCKCHAIN_URL}${burnSysx?.payload.data.tx}`}
          target="_blank"
        >
          {burnSysx?.payload.data.tx}
        </Link>
      </Box>
    </CardContent>
  );
};

const BridgeTransferComplete: React.FC<BridgeTransferCompleteProps> = ({
  isComplete,
}) => {
  const { push } = useRouter();
  const [reinitializing, setReinitializing] = useState(false);
  const {
    transfer: { type },
  } = useTransfer();

  const newTransfer = () => {
    setReinitializing(true);
    push(`/bridge/${Date.now()}`);
  };

  return (
    <Box px={2}>
      <Card variant="outlined" sx={{ mt: 4 }}>
        {type === "sys-to-nevm" && <SysToNevmComplete isComplete={isComplete} />}
        {type === "nevm-to-sys" && <NevmToSysComplete isComplete={isComplete} />}
        {isComplete && (
          <CardActions>
            <LoadingButton
              color="secondary"
              sx={{ ml: "auto" }}
              onClick={newTransfer}
              loading={reinitializing}
            >
              New Transfer <ArrowForward />
            </LoadingButton>
          </CardActions>
        )}
      </Card>
    </Box>
  );
};

export default BridgeTransferComplete;
