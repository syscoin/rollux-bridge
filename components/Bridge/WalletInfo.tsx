import { useTransfer } from "@contexts/Transfer/useTransfer";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Link,
  Snackbar,
  styled,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useConnectedWallet } from "../../contexts/ConnectedWallet/useConnectedWallet";
import SyscoinLogo from "../Icons/syscoin";

type WalletType = "utxo" | "nevm" | string;

interface IProps {
  label: string;
  walletType: WalletType;
  account: string | undefined;
  network: {
    name: string;
    symbol: string;
  };
}

const BridgeWalletInfo: React.FC<IProps> = ({ label, network, walletType }) => {
  const { nevm, utxo, connectUTXO, connectNEVM } = useConnectedWallet();
  const { transfer } = useTransfer();

  return (
    <Box>
      <Typography variant="caption" color="gray">
        {label}
      </Typography>
      <Card variant="outlined" sx={{ mb: 1 }}>
        <CardContent sx={{ p: "1rem !important" }}>
          <SyscoinLogo />
          <Box display="inline-block" sx={{ ml: 1 }}>
            <Typography variant="body1" display="block">
              {network.name}
            </Typography>
            <Typography variant="caption" display="block" color="gray">
              {network.symbol}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      {walletType === "utxo" && utxo.type === "pali-wallet" && (
        <Box display="flex" alignItems="center">
          <Image
            src="/pali-wallet-logo.svg"
            height="32px"
            width="32px"
            alt="PaliWallet logo"
          />
          {transfer.status === "initialize" ? (
            utxo.account ? (
              <Typography variant="body2">{utxo.account}</Typography>
            ) : (
              <Button onClick={() => connectUTXO("pali-wallet")}>
                Connect
              </Button>
            )
          ) : utxo.account ? (
            utxo.account === transfer.utxoAddress ? (
              <Typography variant="body2">{transfer.utxoAddress}</Typography>
            ) : (
              <Typography variant="body2">
                Change to {transfer.utxoAddress}
              </Typography>
            )
          ) : (
            <Button onClick={() => connectUTXO("pali-wallet")}>
              Reconnect
            </Button>
          )}
        </Box>
      )}
      {walletType === "nevm" && nevm.type === "metamask" && (
        <>
          <Box display="flex" alignItems="center">
            <Image
              src="/metamask-logo.svg"
              height="32px"
              width="32px"
              alt="Metamask logo"
            />
            {transfer.status === "initialize" ? (
              nevm.account ? (
                <Typography variant="body2">{nevm.account}</Typography>
              ) : (
                <Button onClick={() => connectNEVM("metamask")}>Connect</Button>
              )
            ) : (
              <Typography variant="body2">{transfer.nevmAddress}</Typography>
            )}
          </Box>
          {(nevm.balance ?? 0) < 0.001 && (
            <Alert severity="error" sx={{ width: "100%", flex: 1 }}>
              <Typography variant="body2">
                It seems your wallet does not have any balance.
              </Typography>
              <Typography variant="body2">
                Please go to{" "}
                <Link href="https://faucet.syscoin.org/">
                  https://faucet.syscoin.org/
                </Link>
              </Typography>
            </Alert>
          )}
        </>
      )}
    </Box>
  );
};

export default BridgeWalletInfo;
