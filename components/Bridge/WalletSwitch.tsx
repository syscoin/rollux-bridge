import { useTransfer } from "@contexts/Transfer/useTransfer";
import { CompareArrows, ArrowForward } from "@mui/icons-material";
import { Grid, IconButton, Typography, Box } from "@mui/material";
import BridgeWalletInfo from "./WalletInfo";

const BridgeWalletSwitch: React.FC = () => {
  const {
    transfer: { type, status, amount },
    setTransferType,
  } = useTransfer();

  const utxoWalletInfo = {
    walletType: "utxo",
    account: "0x0",
    network: { name: "Syscoin Network", symbol: "SYS" },
  };

  const nevmWalletInfo = {
    walletType: "nevm",
    account: "0x0",
    network: { name: "NEVM Network", symbol: "NEVM" },
  };

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={5}>
        <BridgeWalletInfo
          label="From"
          {...(type === "sys-to-nevm" ? utxoWalletInfo : nevmWalletInfo)}
        />
      </Grid>
      <Grid item xs={2} display="flex">
        <Box sx={{ m: "auto", textAlign: 'center' }}>
          {status !== 'initialize' && <Typography variant="body1" color="primary">{amount} SYS</Typography>}
          <IconButton
            color="secondary"
            disabled={status !== "initialize"}
            onClick={() =>
              setTransferType(
                type === "sys-to-nevm" ? "nevm-to-sys" : "sys-to-nevm"
              )
            }
          >
            {status === "initialize" ? <CompareArrows /> : <ArrowForward />}
          </IconButton>
        </Box>
      </Grid>
      <Grid item xs={5}>
        <BridgeWalletInfo
          label="To"
          {...(type === "sys-to-nevm" ? nevmWalletInfo : utxoWalletInfo)}
        />
      </Grid>
    </Grid>
  );
};

export default BridgeWalletSwitch;
