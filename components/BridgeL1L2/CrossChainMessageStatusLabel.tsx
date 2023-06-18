import { MessageStatus } from "@eth-optimism/sdk";
import React, { FC } from "react";


export type CrossChainMessageStatusLabelProps = {
    status: MessageStatus
}

const _mapping = {
    0: 'Unconfirmed L1 to L2 Message',
    1: 'Failed from L1 to L2',
    2: 'State Root Not published',
    3: 'Ready to Prove',
    4: 'In challenge period',
    5: 'Ready for relay',
    6: 'Relayed'
}

export const CrossChainMessageStatusLabel: FC<CrossChainMessageStatusLabelProps> = ({ status }) => {
    return <>
        {_mapping[status] ?? 'n/a'}
    </>
}

export default CrossChainMessageStatusLabel;