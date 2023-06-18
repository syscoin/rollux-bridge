import { Alert, Box, Button, Flex, HStack, Tab, TabList, Tabs, Text } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import { FiatOrBridged } from 'blockchain/NevmRolluxBridge/bridgeProviders/types'
import { useOtherProviders } from 'blockchain/NevmRolluxBridge/bridgeProviders/useOtherProviders'
import WarningInfoBlock from 'components/Common/WarningInfoBlock'
import React, { FC, useEffect, useState } from 'react'
import { CurrentDisplayView } from '../interfaces'
import { OtherProviderBridgeMode } from './types'

export type OtherProvidersListingProps = {
    currentView: CurrentDisplayView,
    selectedIOCurrency: string,
    onClickUseStandardBridge: () => void,
}

export const OtherProvidersListing: FC<OtherProvidersListingProps> = ({ currentView, selectedIOCurrency, onClickUseStandardBridge }) => {
    const providers = useOtherProviders(currentView, selectedIOCurrency as FiatOrBridged);
    const { account } = useEthers();

    const handleClickedUseStandardBridge = () => {
        onClickUseStandardBridge();
    }

    if (!account) return (<>
        <WarningInfoBlock warningText='We are sorry but You can not use this feature without connected wallet. Please click button below and connect Your wallet.'>
            <Button variant={'primary'} onClick={handleClickedUseStandardBridge}>Back to Standard Bridge</Button>
        </WarningInfoBlock>
    </>);

    return (<>

        <WarningInfoBlock warningText='Please note that the following providers are not affiliated with Rollux & Syscoin and we cannot guarantee their safety. Please use at your own risk.'>
            <Button variant={'primary'} onClick={handleClickedUseStandardBridge}>Use Standard Bridge</Button>
        </WarningInfoBlock>

        <Flex flex={1} direction={'row'} justifyContent={'center'}>
            {providers.map((value, index) => {
                const ComponentToRender = value.component;

                if (null === ComponentToRender) return;

                return (<div key={index}>
                    <ComponentToRender payload={{}} mode={currentView} bridgeDetails={value} />
                </div>);
            })}
        </Flex>
    </>)
}
