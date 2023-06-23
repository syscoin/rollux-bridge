import React, { FC } from "react"
import { Text } from "@chakra-ui/react";
import { useSelectedNetwork } from "hooks/rolluxBridge/useSelectedNetwork";
import { SelectedNetworkType } from "blockchain/NevmRolluxBridge/config/networks";
import { useEthers } from "@usedapp/core";

export const MaxBalance: FC<{ onClick: () => void }> = ({ onClick }) => {
    const { selectedNetwork } = useSelectedNetwork();
    const { account } = useEthers();

    if (selectedNetwork === SelectedNetworkType.Unsupported || !account) {
        return (<></>);
    }

    return (<>
        <Text size={'xs'} onClick={onClick} sx={{ cursor: 'pointer' }} color="brand.secondary">( Max )</Text>
    </>);
}