import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  styled,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useConnectedWallet } from "../../contexts/ConnectedWallet/useConnectedWallet";
import SyscoinLogo from "../Icons/syscoin";

const NetworkContainer = styled(Card)({
  padding: "0.5rem",
  margin: "0.5rem 0",
});

interface IProps {
  label: string;
  walletType: "utxo" | "nevm";
  account: string | undefined;
  network: {
    name: string;
    symbol: string;
  };
}

const BridgeWalletInfo: React.FC<IProps> = ({ label, network, walletType }) => {
  const { nevm, utxo } = useConnectedWallet();
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
          <Typography variant="body2">{utxo.account}</Typography>
        </Box>
      )}
      {walletType === "nevm" && nevm.type === "metamask" && (
        <Box display="flex" alignItems="center">
          <Image
            src="/metamask-logo.svg"
            height="32px"
            width="32px"
            alt="PaliWallet logo"
          />
          <Typography variant="body2">{nevm.account}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default BridgeWalletInfo;
