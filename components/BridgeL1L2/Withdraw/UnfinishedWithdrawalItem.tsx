import { Alert, AlertIcon, Badge } from "@chakra-ui/react";
import { MessageStatus } from "@eth-optimism/sdk";
import React, { FC } from "react";
import CrossChainMessageStatusLabel from "../CrossChainMessageStatusLabel";
import { shortenTransactionHash } from "@usedapp/core";
import { Button } from "@chakra-ui/react";

export type UnfinishedWithdrawalItemProps = {
    status: MessageStatus,
    txHash: string,
    onClickView: () => void;
}

export const UnfinishedWithdrawalItem: FC<UnfinishedWithdrawalItemProps> = ({ status, txHash, onClickView }) => {
    return (
        <Alert status="warning" sx={{ marginBottom: 3 }}>
            <AlertIcon />
            <Badge padding={3}>{shortenTransactionHash(txHash)}</Badge><Button onClick={() => {
                onClickView();
            }} variant="primary" width={'100%'} marginLeft="5">View</Button>
        </Alert>
    )
}

export default UnfinishedWithdrawalItem;