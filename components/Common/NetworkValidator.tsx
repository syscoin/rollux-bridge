import { useEthers } from "@usedapp/core";
import { RolluxChain, TanenbaumChain } from "blockchain/NevmRolluxBridge/config/chainsUseDapp";
import React, { FC, useState, useEffect } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';


type NetworkValidatorProps = {
    children: React.ReactNode
}

const allowedChainIds: number[] = [
    TanenbaumChain.chainId,
    RolluxChain.chainId
]

export const NetworkValidator: FC<NetworkValidatorProps> = ({ children }) => {
    const { account, chainId, switchNetwork } = useEthers();
    const [shouldSwitch, setShouldSwitch] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const switchFromModal = () => {
        switchNetwork(allowedChainIds[0]).then(() => {
            handleClose();
        });

    }


    useEffect(() => {
        if (shouldSwitch) {
            handleClickOpen();
        }
    }, [shouldSwitch])

    useEffect(() => {
        if (!open && shouldSwitch) {
            handleClickOpen();
        }
    }, [open, shouldSwitch])


    useEffect(() => {
        if (account && chainId) {
            // if connected wallet.
            if (!allowedChainIds.includes(chainId)) {
                setShouldSwitch(true);
            } else {
                setShouldSwitch(false);
            }

        }
    }, [chainId, account]);


    return (<>
        {shouldSwitch && <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Switch to supported network"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Application will work only when you will be connected to supported chain.
                        Please click Switch Networks before continue.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={switchFromModal} variant="outlined">
                        Switch Networks
                    </Button>
                </DialogActions>
            </Dialog>
        </>}

        {children}
    </>)

}