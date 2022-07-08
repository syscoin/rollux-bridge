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
import { useState } from "react";

const SYSCOIN_TX_BLOCKCHAIN_URL = "https://blockbook.elint.services/tx/";
const NEVM_TX_BLOCKCHAIN_URL = "https://explorer.syscoin.org/tx/";

const SysToNevmComplete = () => {
  const {
    transfer: { logs },
  } = useTransfer();

  const burnSysTx = logs.find((log) => log.status === "burn-sys");
  const burnSysxTx = logs.find((log) => log.status === "burn-sysx");
  const submitProofsTx = logs.find((log) => log.status === "submit-proofs");
  return (
    <>
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
    </>
  );
};

const NevmToSysComplete = () => {
  const {
    transfer: { logs },
  } = useTransfer();

  const nevmBurnSys = logs.find(
    (log) => log.status === "confirm-freeze-burn-sys"
  );
  const mintSysx = logs.find((log) => log.status === "mint-sysx");
  const burnSysx = logs.find((log) => log.status === "burn-sysx");

  return (
    <>
      <Box sx={{ mb: 2 }}>
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
    </>
  );
};

const BridgeTransferComplete: React.FC = () => {
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
      <Alert severity="success">Transfer complete!</Alert>
      <Card variant="outlined" sx={{ mt: 4 }}>
        <CardContent>
          {type === "sys-to-nevm" && <SysToNevmComplete />}
          {type === "nevm-to-sys" && <NevmToSysComplete />}
        </CardContent>
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
      </Card>
    </Box>
  );
};

export default BridgeTransferComplete;
