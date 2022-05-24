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
import ArrowForward from "@mui/icons-material/ArrowForward";

const Bridge: NextPage = () => {
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
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={5}>
              <BridgeWalletInfo
                label="From"
                walletType="utxo"
                account="0x0"
                network={{
                  name: "Syscoin Network",
                  symbol: "SYS",
                }}
              />
            </Grid>
            <Grid item xs={2} display="flex">
              <IconButton sx={{ m: "auto" }} color="secondary" disabled>
                {/* <CompareArrowsIcon /> */}
                <ArrowForward />
              </IconButton>
            </Grid>
            <Grid item xs={5}>
              <BridgeWalletInfo
                label="To"
                walletType="nevm"
                account="0x0"
                network={{
                  name: "NEVM Network",
                  symbol: "NEVM",
                }}
              />
            </Grid>
          </Grid>
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
