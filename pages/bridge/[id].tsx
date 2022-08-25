import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import BridgeWalletInfo from "../../components/Bridge/WalletInfo";
import DrawerPage from "../../components/DrawerPage";
import TransferProvider from "../../contexts/Transfer/Provider";
import BridgeTransferStepSwitch from "components/Bridge/Transfer/StepSwitch";
import BridgeTransferStepper from "components/Bridge/Stepper";
import { useRouter } from "next/router";
import { ArrowForward, CompareArrows } from "@mui/icons-material";
import { ITransfer } from "contexts/Transfer/types";
import BridgeWalletSwitch from "components/Bridge/WalletSwitch";
import { useTransfer } from "@contexts/Transfer/useTransfer";
import { usePaliWallet } from "@contexts/PaliWallet/usePaliWallet";
import { useMetamask } from "@contexts/Metamask/Provider";
import BlocktimeDisclaimer from "components/BlocktimeDisclaimer";

const TransferTitle = () => {
  const { transfer } = useTransfer();
  if (transfer.status === "initialize") {
    return (
      <Typography variant="body1" sx={{ my: 3 }}>
        New Transfer
      </Typography>
    );
  }
  return (
    <Typography variant="body1" sx={{ my: 3 }}>
      Transfer #{transfer.id}
    </Typography>
  );
};

interface Props {
  transfer: ITransfer;
}

const Bridge: NextPage<Props> = ({ transfer }) => {
  const router = useRouter();
  const paliWallet = usePaliWallet();
  const metamask = useMetamask();
  const { id } = router.query;

  if (!id) {
    return <CircularProgress />;
  }

  return (
    <TransferProvider id={id as string}>
      <DrawerPage>
        <BlocktimeDisclaimer/>
        <Container sx={{ mt: 10 }}>
          {paliWallet.isTestnet && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Your Pali Wallet is not set to SYS Main Network.
            </Alert>
          )}
          {metamask.isTestnet && (
            <Alert
              severity="error"
              action={
                <Button onClick={() => metamask.switchToMainnet()}>
                  Switch
                </Button>
              }
              sx={{ mb: 2 }}
            >
              Your Metamask is not set to NEVM Main Network.
            </Alert>
          )}
          <Typography variant="h5" fontWeight="bold">
            Bridge Your SYS
          </Typography>
          <Typography variant="caption" color="gray">
            Trustlessly transfer SYS back and forth between the Syscoin Base and
            Syscoin NEVM blockchains without middlemen!
          </Typography>
          <TransferTitle />
          <BridgeWalletSwitch />
          <BridgeTransferStepper />
          <Grid container>
            <Grid item xs="auto" sx={{ mx: "auto" }}>
              <BridgeTransferStepSwitch />
            </Grid>
          </Grid>
        </Container>
      </DrawerPage>
    </TransferProvider>
  );
};

export default Bridge;
