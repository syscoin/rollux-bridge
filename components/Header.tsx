import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { useEthers, shortenAddress } from "@usedapp/core";
import { SyscoinLogo } from "./Icons/syscoin"
import { AccountBar } from "./HeaderElements/AccountBar"
import React, { FC } from "react";

export const Header: FC = () => {

    const { account, activateBrowserWallet } = useEthers();


    return (
        <Box component={Container} sx={{ marginBottom: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <SyscoinLogo />
                    <Typography variant="h6" component={'div'} sx={{ flexGrow: 1 }}>
                        SysCoin Bridge
                    </Typography>
                    {account && <>
                        <AccountBar />
                    </>}
                    {!account && <>
                        <Button color="success" onClick={() => activateBrowserWallet()} variant="contained">
                            Connect wallet
                        </Button>
                    </>}
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Header;