import React, { FC } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Container, Typography } from '@mui/material';
import { useConnectedWallet } from '@contexts/ConnectedWallet/useConnectedWallet';

export const ConnectWalletBox: FC = () => {
    const connectedWalletCtxt = useConnectedWallet();


    const connectMM = () => {
        connectedWalletCtxt.connectNEVM("metamask")
    }


    return (
        <Box component={Container} sx={{ my: 3 }}>
            <Card>
                <CardContent>
                    <Typography color={'text.secondary'}>
                        Before use this interface you need to connect your Metamask Wallet.
                    </Typography>

                    <Button variant='outlined' onClick={() => connectMM()} fullWidth sx={{ my: 4 }}>
                        Connect Metamask
                    </Button>
                </CardContent>
            </Card>
        </Box>
    )
}

export default ConnectWalletBox;