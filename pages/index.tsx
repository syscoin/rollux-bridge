import { ThemeProvider } from "@emotion/react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import WalletList from "../components/WalletList";
import { useConnectedWallet } from "../contexts/ConnectedWallet/useConnectedWallet";
import HomeHowItWorks from "components/Home/HowItWorks";
import ContactUs from "components/Home/ContactUs";
import FAQ from "components/Home/FAQ";
import Footer from "components/Footer";

const SectionContainer = styled(Box)({
  padding: "4rem",
});

const Home: NextPage = () => {
  const { nevm, utxo } = useConnectedWallet();

  const isReady = nevm.account && utxo.xpub;

  return (
    <Box>
      <Head>
        <title>Syscoin Bridge</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="description" content="Syscoin Trustless Bridge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box component="main">
        <Grid component={Container} container sx={{ my: 3 }}>
          <Grid item md={6}>
            <Box>
              <object
                className="animation"
                type="image/svg+xml"
                data="/bridge-diagram.svg"
                style={{
                  width: "100%",
                }}
              ></object>
            </Box>
          </Grid>
          <Grid item md={6} sx={{ my: "auto", padding: 2 }}>
            <Typography variant="h2" fontWeight="bold">
              SYSCOIN BRIDGE
            </Typography>
            <Typography variant="h6" sx={{ mb: 4 }}>
              Transfer SYS back and forth between the Syscoin and NEVM
              Blockchain
            </Typography>
            <WalletList />
            {isReady && (
              <Box display="flex" justifyContent="space-between">
                <Link href={`/bridge/${Date.now()}`}>
                  <Button variant="contained">
                    Continue
                    <ArrowForwardIcon />
                  </Button>
                </Link>
                <Link href={`/transfers`}>
                  <Button variant="text" color="secondary">
                    View My Transfers
                  </Button>
                </Link>
              </Box>
            )}
          </Grid>
        </Grid>
        <Container>
          <HomeHowItWorks />
        </Container>
        <Box component={FAQ} mb={3} />
        <Box component={ContactUs} mb={3} />
      </Box>
      <Footer />
    </Box>
  );
};

export default Home;
