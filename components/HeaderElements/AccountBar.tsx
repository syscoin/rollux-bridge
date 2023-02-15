import { Box, Button, Container, Grid, Modal, Typography } from "@mui/material";
import React, { FC, useState } from "react";
import { shortenAddress, useEthers } from "@usedapp/core";
import { AccountDetails } from "./AccountDetails";

export const AccountBar: FC = () => {
    const { account } = useEthers();

    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

    const openModal = (): void => {
        setIsModalOpened(true);
    }

    const closeModal = (): void => {
        setIsModalOpened(false);
    }

    return (
        <>
            <Button sx={{ mr: 1 }} variant="contained" color="info" onClick={() => openModal()}>
                {shortenAddress(account ?? '')}
            </Button>

            <Modal
                open={isModalOpened}
                onClose={closeModal}
            >
                <AccountDetails />
            </Modal>
        </>
    )
}

export default AccountBar;