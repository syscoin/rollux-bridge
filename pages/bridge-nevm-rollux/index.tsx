import React, { FC, useState } from "react";
import { NextPage } from "next";
import { Box, Grid, Container, Card, CardContent, Typography, ButtonBase } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";

type BridgeNevmRolluxProps = {}

enum CurrentDisplayView {
    deposit,
    withdraw
}

export const BridgeNevmRollux: NextPage<BridgeNevmRolluxProps> = ({ }) => {
    const router = useRouter();
    const [currentDisplay, setCurrentDisplay] = useState<CurrentDisplayView>(CurrentDisplayView.deposit);


    return (
        <Box>
            <Head>
                <title>Syscoin Bridge | Rollux & NEVM </title>
                <link rel="shortcut icon" href="/favicon.ico" />
                <meta name="description" content="Syscoin Trustless Bridge" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Box component={Container} sx={{ alignItems: 'center', my: 3 }}>
                <Grid container spacing={2}>
                    <Grid xs={12} item>
                        <Card variant="outlined" sx={{ padding: '10px' }}>
                            <Typography variant="h3">
                                Swap your SYS between NEVM and Rollux.
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <Box component={Container} sx={{ alignItems: 'center', my: 3 }}>
                <Grid container spacing={3}>
                    <Grid xs={6} item alignItems={'center'}>
                        <Card variant="outlined" sx={{ width: 1 }}>
                            <ButtonBase onClick={(event) => console.log("Deposit")} sx={{ width: 1 }}>
                                <CardContent sx={{ alignContent: 'center' }}>
                                    <Typography variant="h5" textAlign={'center'}>
                                        Deposit
                                    </Typography>
                                </CardContent>
                            </ButtonBase>
                        </Card>
                    </Grid>
                    <Grid xs={6} item alignItems={'center'}>
                        <Card variant="outlined" sx={{ width: 1 }}>
                            <ButtonBase onClick={(event) => console.log("Withdraw")} sx={{ width: 1 }}>
                                <CardContent sx={{ alignContent: 'center' }}>
                                    <Typography variant="h5" textAlign={'center'}>
                                        Withdraw
                                    </Typography>
                                </CardContent>
                            </ButtonBase>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default BridgeNevmRollux;