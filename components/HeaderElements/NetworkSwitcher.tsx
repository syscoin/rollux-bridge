import React, { FC } from 'react'
import { Select } from '@chakra-ui/react';
import { useSelectedNetwork } from 'hooks/rolluxBridge/useSelectedNetwork';
import { CheckCircleIcon, MoonIcon, WarningIcon } from "@chakra-ui/icons"
import { SelectedNetworkType } from 'blockchain/NevmRolluxBridge/config/networks';

export const NetworkSwitcher: FC<{}> = () => {

    const { selectedNetwork, atWhichLayer, changeNetworks } = useSelectedNetwork();
    // console.log(`Layer ${atWhichLayer} / ${selectedNetwork}`);
    return (
        <>
            <Select width={{
                xs: '15vw',
                'md': '10vw',
                base: undefined
            }}
                bg={{
                    xs: 'white'
                }}
                icon={
                    selectedNetwork === SelectedNetworkType.Mainnet ? <CheckCircleIcon /> :
                        selectedNetwork === SelectedNetworkType.Testnet ? <MoonIcon /> : <WarningIcon />
                } value={selectedNetwork} onChange={(e) => changeNetworks(Number(e.target.value), atWhichLayer ?? 1)}>
                <option value="0">Mainnet</option>
                <option value="1">Testnet</option>
                <option value="3">Testnet Nebula [L2]</option>
                <option value="99999" disabled>Unsupported</option>
            </Select>

        </>
    )
}

export default NetworkSwitcher;