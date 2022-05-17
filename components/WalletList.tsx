import { Button, Box, Typography } from "@mui/material";
import Image from "next/image";
import { useConnectedWallet } from "../contexts/ConnectedWallet/useConnectedWallet";

const WalletList: React.FC = () => {
  const { nevm, utxo, connectNEVM, connectUTXO } = useConnectedWallet();
  return (
    <Box>
      <Typography variant="body2">Connect Wallet:</Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Image
          src="/pali-wallet-logo.svg"
          height="32px"
          width="32px"
          alt="PaliWallet logo"
        />
        {utxo.type === "pali-wallet" && utxo.account ? (
          <>
            <Typography variant="body1" color="secondary">
              {utxo.account}
            </Typography>
            <Typography
              variant="body1"
              color="success.main"
              sx={{ ml: "auto" }}
            >
              CONNECTED
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="body1">PaliWallet</Typography>
            <Button
              sx={{ ml: "auto" }}
              variant="contained"
              onClick={() => connectUTXO("pali-wallet")}
            >
              Connect
            </Button>
          </>
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Image
          src="/metamask-logo.svg"
          height="32px"
          width="32px"
          alt="PaliWallet logo"
        />

        {nevm.type === "metamask" && nevm.account ? (
          <>
            <Typography variant="body1" color="secondary">
              {nevm.account}
            </Typography>
            <Typography
              variant="body1"
              color="success.main"
              sx={{ ml: "auto" }}
            >
              CONNECTED
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="body1">Metamask</Typography>
            <Button
              sx={{ ml: "auto" }}
              variant="contained"
              onClick={() => connectNEVM("metamask")}
            >
              Connect
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default WalletList;
