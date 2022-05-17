import { Box, Container, Grid, IconButton, Typography } from "@mui/material";
import { NextPage } from "next";
import BridgeWalletInfo from "../../components/Bridge/WalletInfo";
import DrawerPage from "../../components/DrawerPage";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

const Bridge: NextPage = () => {
  return (
    <DrawerPage>
      <Container sx={{ mt: 10 }}>
        <Typography variant="h5" fontWeight="bold">
          Bridge Tokens
        </Typography>
        <Typography variant="caption" color="gray">
          Transfer SYS back and forth between the Syscoin and NEVM blockchains.
        </Typography>

        <Typography variant="body1" sx={{ my: 3 }}>
          New Transfer
        </Typography>
        <Grid container spacing={2}>
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
          <Grid item xs={1} display="flex">
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
      </Container>
    </DrawerPage>
  );
};

export default Bridge;
