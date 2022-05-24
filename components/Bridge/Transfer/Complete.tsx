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
import { useTransfer } from "contexts/Transfer/useTransfer";
import { useRouter } from "next/router";

const SYSCOIN_TX_BLOCKCHAIN_URL = "https://blockbook.elint.services/tx/";
const NEVM_TX_BLOCKCHAIN_URL = "https://explorer.syscoin.org/tx/";

const BridgeTransferComplete: React.FC = () => {
  const { push } = useRouter();
  const {
    transfer: { logs },
  } = useTransfer();

  const burnSysTx = logs.find((log) => log.status === "burn-sys");
  const burnSysxTx = logs.find((log) => log.status === "burn-sysx");
  const submitProofsTx = logs.find((log) => log.status === "submit-proofs");

  const newTransfer = () => {
    push(`/bridge/${Date.now()}`);
  };

  return (
    <Box px={2}>
      <Alert severity="success">Transfer complete!</Alert>
      <Card variant="outlined" sx={{ mt: 4 }}>
        <CardContent>
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
        <CardActions>
          <Button color="secondary" sx={{ ml: "auto" }} onClick={newTransfer}>
            New Transfer <ArrowForward />
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default BridgeTransferComplete;
