import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import BridgeWalletInfo from "../../components/Bridge/WalletInfo";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import DrawerPage from "../../components/DrawerPage";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import TransferProvider from "../../contexts/Transfer/Provider";
import { useTransfer } from "../../contexts/Transfer/useTransfer";
import BridgeSysToSysxForm from "../../components/Bridge/SysToSysxForm";

const Bridge: NextPage = () => {
  return (
    <TransferProvider id="test">
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
              <IconButton sx={{ m: "auto" }} color="secondary">
                <CompareArrowsIcon />
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
          <Stepper activeStep={0} alternativeLabel sx={{ mb: 2 }}>
            <Step>
              <StepLabel>Transfer</StepLabel>
            </Step>
            <Step>
              <StepLabel>Prove</StepLabel>
            </Step>
            <Step>
              <StepLabel>Mint</StepLabel>
            </Step>
          </Stepper>
          <Grid container>
            <Grid item xs="auto" sx={{ mx: "auto" }}>
              <BridgeSysToSysxForm />
            </Grid>
          </Grid>
        </Container>
      </DrawerPage>
    </TransferProvider>
  );
};

export default Bridge;
