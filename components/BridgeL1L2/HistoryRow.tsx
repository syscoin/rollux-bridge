import { MessageStatus } from "@eth-optimism/sdk"
import React, { FC } from "react"
import { Tr, Td, Link, Badge } from "@chakra-ui/react"
import { shortenIfTransactionHash } from "@usedapp/core"

export type HistoryRowProps = {
    time: Date,
    type: string,
    amount: string,
    transactionHash: string,
    actionStatus: MessageStatus,
    onClickAction: () => void
}

export const HistoryRow: FC<HistoryRowProps> = ({ time, type, amount, transactionHash, actionStatus, onCLickAction }) => {
    return (
        <Tr>
            <Td>
                {time.toLocaleDateString()}
            </Td>
            <Td>
                {type}
            </Td>
            <Td>
                {amount}
            </Td>
            <Td>
                <Link href="#" bgColor={'Highlight'}>
                    {shortenIfTransactionHash(transactionHash)}
                </Link>
            </Td>
            <Td>
                {actionStatus === MessageStatus.RELAYED && <Badge colorScheme={'green'}>Success</Badge>}
                {actionStatus !== MessageStatus.RELAYED && <Badge colorScheme={'orange'}>In process</Badge>}
            </Td>
        </Tr>
    )
}

export default HistoryRow;