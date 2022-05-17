import { Box, styled, Typography } from "@mui/material";
import Image from "next/image";
import { useConnectedWallet } from "../../contexts/ConnectedWallet/useConnectedWallet";

const NetworkContainer = styled(Box)({
  border: "1px solid gray",
  padding: "0.5rem",
  margin: "0.5rem 0",
  borderRadius: "0.25rem",
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
      <NetworkContainer>
        <Typography variant="body1" display="block">
          {network.name}
        </Typography>
        <Typography variant="caption" display="block" color="gray">
          {network.symbol}
        </Typography>
      </NetworkContainer>
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
