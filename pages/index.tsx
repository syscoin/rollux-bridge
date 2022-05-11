import { ThemeProvider } from "@emotion/react";
import {
  Box,
  Button,
  Container,
  Drawer,
  Grid,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import theme from "../components/theme";

const Home: NextPage = () => {
  return (
    <ThemeProvider theme={theme}>
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
                <Image
                  width={"720px"}
                  layout="intrinsic"
                  height={"720px"}
                  alt="bridge animation"
                  src="/bridge-diagram.svg"
                />
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
              <Box>
                <Typography variant="body2">Connect Wallet:</Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Image
                    src="/pali-wallet-logo.svg"
                    height="32px"
                    width="32px"
                    alt="PaliWallet logo"
                  />
                  <Typography variant="body1">PaliWallet</Typography>
                  <Button sx={{ ml: "auto" }} variant="contained">
                    Connect
                  </Button>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Image
                    src="/metamask-logo.svg"
                    height="32px"
                    width="32px"
                    alt="PaliWallet logo"
                  />
                  <Typography variant="body1">Metamask</Typography>
                  <Button sx={{ ml: "auto" }} variant="contained">
                    Connect
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Home;
