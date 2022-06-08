import {
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

interface Props {
  transfer: ITransfer;
}

const Bridge: NextPage<Props> = ({ transfer }) => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return <CircularProgress />;
  }

  return (
    <TransferProvider id={id as string}>
      <DrawerPage>
        <Container sx={{ mt: 10 }}>
          <Typography variant="h5" fontWeight="bold">
            Bridge Tokens
          </Typography>
          <Typography variant="caption" color="gray">
            Transfer SYS back and forth between the Syscoin and NEVM
            blockchains.
          </Typography>

          <Typography variant="body1" sx={{ my: 3 }}>
            New Transfer
          </Typography>
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
