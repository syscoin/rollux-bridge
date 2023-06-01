import { Flex, FormControl, FormLabel, Switch } from '@chakra-ui/react'
import React, { FC, useState } from 'react'
import { CurrentDisplayView } from '../interfaces'
import { OtherProviderBridgeMode } from './types'

export type OtherProvidersListingProps = {
    currentView: CurrentDisplayView
}

export const OtherProvidersListing: FC<OtherProvidersListingProps> = ({ currentView }) => {
    const [bridgeMode, setBridgeMode] = useState<OtherProviderBridgeMode>(OtherProviderBridgeMode.crypto)

    return (<>
        <Flex direction={'row'} justifyContent={'center'} alignItems={'center'} alignSelf={'center'}>
            <FormControl display="flex" alignItems="center" justifyContent="center">
                <FormLabel>
                    Crypto
                </FormLabel>
            </FormControl>
            <FormControl display="flex" alignItems="center" justifyContent="center">
                <Switch size={'md'} alignSelf={'center'} onChange={(event) => {

                    setBridgeMode(event.target.checked === true ? OtherProviderBridgeMode.fiat : OtherProviderBridgeMode.crypto);
                }} />
            </FormControl>
            <FormControl display="flex" alignItems="center" justifyContent="center">
                <FormLabel>
                    Fiat
                </FormLabel>
            </FormControl>
        </Flex >

        <Flex>
            {bridgeMode} {OtherProviderBridgeMode[bridgeMode]}
        </Flex>
    </>)
}