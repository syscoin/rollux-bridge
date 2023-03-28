import React, { FC } from 'react'
import { Select } from '@chakra-ui/react';
import { useSelectedNetwork } from 'hooks/rolluxBridge/useSelectedNetwork';

export const NetworkSwitcher: FC<{}> = () => {

    const { selectedNetwork, atWhichLayer, changeNetworks } = useSelectedNetwork();
    console.log(`Layer ${atWhichLayer} / ${selectedNetwork}`);
    return (
        <>
            <Select sx={{ width: '20vw' }} value={selectedNetwork} onChange={(e) => changeNetworks(Number(e.target.value), atWhichLayer ?? 1)}>
                <option value="0">Mainnet</option>
                <option value="1">Testnet</option>
                <option value="2" disabled>Unsupported</option>
            </Select>

        </>
    )
}

export default NetworkSwitcher;