import { Box, Flex, Tab, TabList, Tabs, Text } from '@chakra-ui/react'
import { useOtherProviders } from 'blockchain/NevmRolluxBridge/bridgeProviders/useOtherProviders'
import React, { FC, useState } from 'react'
import { CurrentDisplayView } from '../interfaces'
import { OtherProviderBridgeMode } from './types'

export type OtherProvidersListingProps = {
    currentView: CurrentDisplayView
}

export const OtherProvidersListing: FC<OtherProvidersListingProps> = ({ currentView }) => {
    const [bridgeMode, setBridgeMode] = useState<OtherProviderBridgeMode>(OtherProviderBridgeMode.crypto)
    const providers = useOtherProviders(currentView, bridgeMode);

    const handleTabsChange = (index: number) => {
        setBridgeMode(index === 0 ? OtherProviderBridgeMode.crypto : OtherProviderBridgeMode.fiat);
    };

    return (<>
        <Box maxW="483px" mb={3}>
            <Tabs onChange={handleTabsChange} variant="enclosed" isLazy>
                <TabList display="flex" justifyContent="center">
                    <Tab flex={1} sx={{ bg: 'brand.secondaryGradient' }} _selected={{ color: "black.500", bg: "brand.primaryGradient", borderColor: "gray.500" }}>Crypto</Tab>
                    <Tab flex={1} sx={{ bg: 'brand.secondaryGradient' }} _selected={{ color: "black.500", bg: "brand.primaryGradient", borderColor: "gray.500" }}>Fiat</Tab>
                </TabList>
            </Tabs>
        </Box>
        <Flex flex={1} direction={'row'} maxW="483px" justifyContent={'center'}>
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
