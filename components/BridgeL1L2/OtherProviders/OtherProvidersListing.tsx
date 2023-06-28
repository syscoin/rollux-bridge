import { Alert, Box, Button, Flex, HStack, Tab, TabList, Tabs, Text, VStack } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import { FiatOrBridged } from 'blockchain/NevmRolluxBridge/bridgeProviders/types'
import { useOtherProviders } from 'blockchain/NevmRolluxBridge/bridgeProviders/useOtherProviders'
import WarningInfoBlock from 'components/Common/WarningInfoBlock'
import { ethers } from 'ethers'
import React, { FC, useEffect, useState } from 'react'
import { CurrentDisplayView } from '../interfaces'
import SelectTokenBadge from '../Standard/SelectTokenBadge'
import SelectTokenModal from '../Standard/SelectTokenModal'
import { OtherProviderBridgeMode } from './types'
import { useTokenList } from 'hooks/rolluxBridge/useTokenList'
import { useSelectedNetwork } from 'hooks/rolluxBridge/useSelectedNetwork'
import TokenListToken from 'blockchain/NevmRolluxBridge/interfaces/TokenListToken'
import { DepositBlockInputNetworkSelector } from './ListingBlocks/DepositBlockInputNetworkSelector'
import { getKeyValue, isCryptoProvider } from 'blockchain/NevmRolluxBridge/bridgeProviders/helpers'

export type OtherProvidersListingProps = {
    currentView: CurrentDisplayView,
    selectedIOCurrency: string,
    selectedNetwork: string,
    onClickUseStandardBridge: () => void,
}

export const OtherProvidersListing: FC<OtherProvidersListingProps> = ({ currentView, selectedNetwork, selectedIOCurrency, onClickUseStandardBridge }) => {

    const { l1ChainId, l2ChainId } = useSelectedNetwork();
    const [selectedToken, setSelectedToken] = useState<{
        name: string,
        symbol: string,
        decimals: number,
        address: string,
        logoURI: string,
        chainId: number,
    }>({ address: '', decimals: 18, chainId: l1ChainId, name: 'Syscoin', symbol: 'SYS', logoURI: '/syscoin-logo.svg' });
    const [selectedInputNetwork, setSelectedInputNetwork] = useState<string>(selectedIOCurrency);
    const providers = useOtherProviders(currentView, selectedInputNetwork as FiatOrBridged, selectedToken);
    const { account } = useEthers();
    const [showTokenSelector, setShowTokenSelector] = useState<boolean>(false);
    const { tokenList, filteredTokenList, loading } = useTokenList(
        currentView === CurrentDisplayView.deposit ?
            l1ChainId as number :
            l2ChainId as number
    );

    useEffect(() => {
        if (currentView === CurrentDisplayView.withdraw) {
            setShowTokenSelector(true);
        }
    }, [currentView]);


    const handleClickedUseStandardBridge = () => {
        onClickUseStandardBridge();
    }

    if (!account) return (<>
        <WarningInfoBlock warningText='We are sorry but You can not use this feature without connected wallet. Please click button below and connect Your wallet.'>
            <Button variant={'primary'} onClick={handleClickedUseStandardBridge}>Back to Standard Bridge</Button>
        </WarningInfoBlock>
    </>);

    return (<>

        {currentView === CurrentDisplayView.deposit ?
            <DepositBlockInputNetworkSelector
                onInputNetworkChange={(network) => {

                    setSelectedInputNetwork(network)

                    setShowTokenSelector(isCryptoProvider(network))

                    if (network === 'SYS') {
                        onClickUseStandardBridge();
                    }
                }}
                preSelectedNetwork={selectedIOCurrency}
            /> : <></>}



        {showTokenSelector && <>

            <HStack spacing={4} mt={4} mb={1} justifyContent={'left'} alignItems={'left'}>
                {currentView === CurrentDisplayView.deposit ?
                    <Text fontSize={'lg'} fontWeight={'bold'}>Token to deposit</Text> :
                    <Text fontSize={'lg'} fontWeight={'bold'}>Token to withdraw</Text>
                }
            </HStack>


            <HStack spacing={4} mb={4} justifyContent={'left'} alignItems={'left'}>
                <SelectTokenModal
                    disableAdditionalStyling={true}
                    tokens={filteredTokenList}
                    chainId={currentView === CurrentDisplayView.deposit ? l1ChainId as number : l2ChainId as number}
                    onSelect={(token) => { setSelectedToken(token) }}
                    selectedToken={selectedToken}
                />
            </HStack>
        </>}

        {providers.length > 0 && <>
            <Flex flex={1} direction={'row'} justifyContent={'center'}>
                {providers.map((value, index) => {
                    const ComponentToRender = value.component;

                    if (null === ComponentToRender) return;

                    return (
                        <ComponentToRender key={index} payload={{
                            token: selectedToken,
                            inputNetwork: selectedInputNetwork,
                            direction: currentView === CurrentDisplayView.deposit ? 'deposit' : 'withdraw',
                        }} mode={currentView} bridgeDetails={value} />
                    );
                })}
            </Flex>
        </>}

        {providers.length === 0 && <>
            <Box sx={{
                textAlign: 'center',
                width: '100%',
                backgroundColor: 'brand.lightPrimary',
                borderRadius: '4px',
                p: 3,
                pb: 5
            }}>
                <Text fontSize={'xl'} color={'gray.500'}>No results</Text>
                <Text color={'gray.500'}>
                    There are no bridges to directly transfer {selectedToken.symbol} from at the moment.
                </Text>
            </Box>
        </>}


    </>)
}
