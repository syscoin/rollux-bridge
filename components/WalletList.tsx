import { Button, Box, Typography, Link } from "@mui/material";
import Image from "next/image";
import { useConnectedWallet } from "../contexts/ConnectedWallet/useConnectedWallet";
import { Launch } from "@mui/icons-material";

const WalletList: React.FC = () => {
  const { nevm, utxo, connectNEVM, connectUTXO, availableWallets } =
    useConnectedWallet();
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
            <Typography
              variant="body1"
              color="secondary"
              noWrap
              maxWidth={"70%"}
            >
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
            <Link
              href="https://chrome.google.com/webstore/detail/pali-wallet/mgffkfbidihjpoaomajlbgchddlicgpn"
              title="Download Pali Wallet"
            >
              <Launch />
            </Link>
            <Button
              sx={{ ml: "auto" }}
              variant="contained"
              onClick={() => connectUTXO("pali-wallet")}
              disabled={!availableWallets.paliWallet}
            >
              {availableWallets.paliWallet
                ? "Connect"
                : availableWallets.paliWallet === undefined
                ? "Checking Pali Wallet"
                : "Not installed"}
            </Button>
          </>
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Image
          src="/metamask-logo.svg"
          height="32px"
          width="32px"
          alt="Metamask logo"
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
            <Link
              href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
              title="Download Metamask"
            >
              <Launch />
            </Link>
            <Button
              sx={{ ml: "auto" }}
              variant="contained"
              onClick={() => connectNEVM("metamask")}
              disabled={!availableWallets.metamask}
            >
              {availableWallets.metamask ? "Connect" : "Not installed"}
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default WalletList;
