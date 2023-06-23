import { ChevronDownIcon, ChevronRightIcon, InfoIcon, RepeatClockIcon } from '@chakra-ui/icons';
import {
    Button, Flex, FormControl, Spacer, Skeleton, FormErrorMessage, FormLabel, HStack, Image, NumberInput, NumberInputField, Text, useBreakpointValue, useToast, VStack, Wrap
} from '@chakra-ui/react';
import { ERC20Interface, useEtherBalance, useEthers, useTokenAllowance, useTokenBalance } from '@usedapp/core';
import { NEVMChain, TanenbaumChain } from 'blockchain/NevmRolluxBridge/config/chainsUseDapp';
import { SelectedNetworkType } from 'blockchain/NevmRolluxBridge/config/networks';
import { fetchERC20TokenList } from 'blockchain/NevmRolluxBridge/fetchers/ERC20TokenList';
import TokenListToken from 'blockchain/NevmRolluxBridge/interfaces/TokenListToken';
import { OtherProvidersMenuSelector } from 'components/BridgeL1L2/OtherProviders/OtherProvidersMenuSelector';
import WarningInfoBlock from 'components/Common/WarningInfoBlock';
import { ConnectButton } from 'components/ConnectButton';
import { BigNumber, Contract, ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import React, { FC, useEffect, useState, useCallback } from 'react';
import { useSelectedNetwork } from "../../../hooks/rolluxBridge/useSelectedNetwork"
import ReviewDeposit from '../Deposit/ReviewDeposit';
import { DirectionSwitcherArrow } from '../DirectionSwitcherArrow';
import { MaxBalance } from '../MaxBalance';
import { useCrossChainMessenger } from "../../../hooks/rolluxBridge/useCrossChainMessenger";
import { useEstimateTransaction } from 'hooks/rolluxBridge/useEstimateTransaction';
import SelectTokenModal from './SelectTokenModal';
import { RolluxLogo } from 'components/Icons/RolluxLogo';

export type DepositPartProps = {
    onClickDepositButton: (amount: string) => void;
    onClickApproveERC20: (l1Token: string, l2Token: string, amount: BigNumber) => void;
    onClickDepositERC20: (l1Token: string, l2Token: string, amount: BigNumber) => void;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    onSelectBridgeProvider: (provider: string, force: boolean) => void;
    onSwapDirection: () => void;
    depositTx: string | undefined;
    setDepositTx: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const DepositPart: FC<DepositPartProps> = ({ onClickDepositButton, onClickApproveERC20, onClickDepositERC20, setIsLoading, onSelectBridgeProvider, onSwapDirection, depositTx, setDepositTx }) => {
    const [currency, setCurrency] = useState<string>('SYS');
    const [selectedTokenAddress, setSelectedTokenAddress] = useState<string | undefined>(undefined);
    const [selectedTokenAddressL2, setSelectedTokenAddressL2] = useState<string | undefined>(undefined);
    const [balanceToDisplay, setBalanceToDisplay] = useState<string>('');
    const [selectedTokenDecimals, setSelectedTokenDecimals] = useState<number>(18);
    const [amountToSwap, setAmountToSwap] = useState<string>('');

    const { l1ChainId, l2ChainId, rpcL1, rpcL2, selectedNetwork, contractsL1 } = useSelectedNetwork();

    const { account, chainId, switchNetwork } = useEthers();
    const balanceNativeToken = useEtherBalance(account, { chainId: l1ChainId });
    const balanceERC20Token = useTokenBalance(selectedTokenAddress, account, { chainId: l1ChainId });

    const balanceNativeTokenL2 = useEtherBalance(account, { chainId: l2ChainId }) ?? 0;
    const balanceERC20TokenL2 = useTokenBalance(selectedTokenAddressL2, account, { chainId: l2ChainId }) ?? 0;


    const allowanceERC20Token = useTokenAllowance(selectedTokenAddress, account, contractsL1.L1StandardBridge, {
        chainId: l1ChainId
    });
    const [allERC20Tokens, setAllERC20Tokens] = useState<TokenListToken[]>([]);
    const [l1ERC20Tokens, setL1ERC20Tokens] = useState<TokenListToken[]>([]);
    const [l2ERC20Tokens, setL2ERC20Tokens] = useState<TokenListToken[]>([]);
    const [estimatedTxPrice, setEstimatedTxPrice] = useState<{
        usdEstimate: number | undefined,
        weiEstimate: number | undefined
    }>({ usdEstimate: undefined, weiEstimate: undefined });

    const [tokenBalancesMap, setTokenBalancesMap] = useState<{ [key: string]: string }>({});

    const selectedToken = currency !== 'SYS' ?
        l1ERC20Tokens?.find(token => token.symbol === currency) :
        { address: '', chainId: l1ChainId, decimals: 18, name: 'Syscoin', symbol: 'SYS', logoURI: '/syscoin-logo.svg' }

    const messenger = useCrossChainMessenger();

    const [showDepositSent, setShowDepositSent] = useState<boolean>(false);
    const [showTxDetails, setShowTxDetails] = useState<boolean>(false);

    const { calculateEstimate } = useEstimateTransaction();
    useEffect(() => {
        if (parseFloat(amountToSwap) == 0 || !messenger) {
            return; // break here
        }

        setEstimatedTxPrice({
            usdEstimate: undefined,
            weiEstimate: undefined
        })

        console.log(selectedTokenAddress, selectedTokenAddressL2, amountToSwap, selectedTokenDecimals)

        try {
            const gasLimit = (selectedTokenAddress !== ethers.constants.AddressZero && selectedTokenAddress
                && selectedTokenAddressL2 && selectedTokenDecimals
            ) ?
                messenger.estimateGas.depositERC20(
                    selectedTokenAddress,
                    selectedTokenAddressL2,
                    ethers.utils.parseUnits(amountToSwap, selectedTokenDecimals)
                ) : messenger.estimateGas.depositETH(ethers.utils.parseUnits(amountToSwap || '0', 18))

            gasLimit.then(async (gasLimit) => {
                const estimateResult = await calculateEstimate(
                    gasLimit,
                    1);

                if (estimateResult === undefined) {
                    console.warn('Failed to estimate transaction price.');
                    return;
                }

                setEstimatedTxPrice(estimateResult);
            }).catch((e) => {
                console.warn(e);
            })
        } catch (e) {
            console.warn(e);
        }

    }, [messenger, amountToSwap, selectedTokenDecimals, selectedTokenAddress, selectedTokenAddressL2, calculateEstimate]);

    useEffect(() => {
        if (showDepositSent && depositTx) {
            setShowDepositSent(false);
            setShowTxDetails(true);
        }
    }, [showDepositSent, depositTx])

    // balance hook

    const preCheckNetwork = useCallback(async (neededNetwork: number, chainId: number) => {
        if (chainId !== neededNetwork) {
            await switchNetwork(neededNetwork);
        }
    }, [switchNetwork])


    useEffect(() => {

        if (currency === 'SYS') {
            // native

            if (balanceNativeToken) {
                setBalanceToDisplay(
                    ethers.utils.formatEther(balanceNativeToken)
                )
            }
        } else {
            try {

                if (balanceERC20Token) {
                    setBalanceToDisplay(
                        ethers.utils.formatUnits(balanceERC20Token, selectedTokenDecimals)
                    )
                } else {
                    setBalanceToDisplay('0.00');
                }
            } catch (e) {
                console.warn("Failed to load token balance");
                console.warn(e);

                setBalanceToDisplay('0.00');
            }
        }
    }, [balanceNativeToken, balanceERC20Token, currency, selectedTokenDecimals, account]);

    // currency hook
    useEffect(() => {

        if ('SYS' === currency) {
            setSelectedTokenAddress(undefined);
            setSelectedTokenAddressL2(undefined);
            setSelectedTokenDecimals(18);
            return;
        }

        let findToken: TokenListToken | undefined = undefined;
        let findTokenL2: TokenListToken | undefined = undefined;

        l1ERC20Tokens.forEach((value) => {
            if (value.symbol === currency) {
                findToken = value;
            }
        })

        if (findToken) {
            console.log(findToken);
            // @ts-ignore
            setSelectedTokenAddress(findToken.address);
            // @ts-ignore
            setSelectedTokenDecimals(findToken.decimals);

            l2ERC20Tokens.forEach((value) => {
                if (value.symbol === currency && typeof findTokenL2 === 'undefined') {
                    findTokenL2 = value;
                }
            })
            if (findTokenL2) {
                //@ts-ignore
                setSelectedTokenAddressL2(findTokenL2.address);
            }
        }

    }, [currency, l1ERC20Tokens, l2ERC20Tokens]);


    /** load tokens hook */
    useEffect(() => {

        fetchERC20TokenList().then((tokens) => {
            const tokensL1: TokenListToken[] = tokens.filter((token) => {
                if (token.chainId === l1ChainId) {
                    return true;
                }

                return false;
            })

            setL1ERC20Tokens(tokensL1);


            if (account) {
                /**
                 * balances mapping
                 */

                const balancesInfo: { [key: string]: string } = {};

                tokensL1.forEach((token) => {
                    // viewTokenBalance(token.address, token.decimals, account).then((balance: string) => {
                    //     balancesInfo[token.symbol] = balance;
                    // })
                })

                setTokenBalancesMap(balancesInfo);
            }

            const tokensL2: TokenListToken[] = tokens.filter((token) => {
                if (token.chainId === l2ChainId) {
                    return true;
                }

                return false;
            })

            setL2ERC20Tokens(tokensL2);


            // set all tokens

            setAllERC20Tokens(tokens);

        })
    }, [account, l1ChainId, l2ChainId]);

    const handleApproval = useCallback(async () => {
        if (selectedTokenAddress && selectedTokenAddressL2) {

            await preCheckNetwork(l1ChainId, chainId as number);

            setIsLoading(true);
            onClickApproveERC20(selectedTokenAddress, selectedTokenAddressL2, ethers.utils.parseUnits(amountToSwap, selectedTokenDecimals));



        }
    }, [selectedTokenAddress, l1ChainId, selectedTokenAddressL2, preCheckNetwork, chainId, setIsLoading, onClickApproveERC20, amountToSwap, selectedTokenDecimals]);

    const handleERC20Deposit = async () => {
        if (selectedTokenAddress && selectedTokenAddressL2) {

            await preCheckNetwork(l1ChainId, chainId as number);

            setIsLoading(true);
            onClickDepositERC20(selectedTokenAddress, selectedTokenAddressL2, ethers.utils.parseUnits(amountToSwap, selectedTokenDecimals));
        }
    }


    return (
        <Flex flexDir="column" pb={4} pr={1} pl={1}>
            <FormControl isInvalid={false}>
                <Flex justifyContent="space-between">

                    <OtherProvidersMenuSelector preSelectLabel={'From'} onSelect={(provider) => onSelectBridgeProvider(provider, false)} />
                    <Spacer />

                </Flex>
                <HStack bg="brand.lightPrimary" borderRadius="6px" mt={1} minH="48px" pl="19px" pr={'0px'} border={parseFloat(balanceToDisplay) < parseFloat(amountToSwap) ? '2px solid' : 'none'} borderColor="red.400">
                    <NumberInput w={'100%'} value={(amountToSwap.length > 0) ? amountToSwap : ''} variant="unstyled" size="lg" onChange={(valueAsString) => {

                        setAmountToSwap(valueAsString)

                    }}>
                        <NumberInputField placeholder='0.00' />
                    </NumberInput>
                    <Spacer />
                    <SelectTokenModal
                        tokens={l1ERC20Tokens}
                        onSelect={(token) => {
                            setCurrency(token.symbol);
                            setAmountToSwap('0.00');
                        }}
                        chainId={l1ChainId}
                        selectedToken={selectedToken !== undefined ? selectedToken : { address: '', chainId: l1ChainId, decimals: 18, name: 'Syscoin', symbol: 'SYS', logoURI: '/syscoin-logo.svg' }}
                    />

                </HStack>

                <FormErrorMessage>Invalid amount</FormErrorMessage>

            </FormControl>
            <HStack ml={1} mt={2}>
                {
                    selectedToken && selectedToken?.symbol !== 'SYS' ?
                        <><Text textAlign={'right'} mr={3} opacity={.5}>Available {balanceToDisplay} </Text><MaxBalance onClick={() => {
                            setAmountToSwap(balanceToDisplay);
                        }} /></> : selectedToken ?
                            <><Text textAlign={'right'} mr={3} opacity={.5}>Available {balanceNativeToken ? (+formatEther(balanceNativeToken)).toFixed(4) : '0.00'} </Text><MaxBalance onClick={() => {
                                setAmountToSwap(balanceNativeToken ? formatEther(balanceNativeToken).toString() : '0.00');
                            }} /></> : <></>
                }
            </HStack>
            <DirectionSwitcherArrow onClick={onSwapDirection} />
            {selectedToken && (
                <Flex flexDir="column" maxW="100%" mt={3} backgroundColor={'brand.lightPrimary'} borderRadius={'4px'} p={3}>
                    <HStack mt={{ base: '3px', md: '12px' }} ml={2}>
                        <Text fontWeight={700} >
                            To
                        </Text>
                        <RolluxLogo width={20} height={20} />
                        <Text fontWeight={700}>
                            Rollux
                        </Text>
                    </HStack>



                    <Wrap alignItems="center" mt={1} ml={3} spacing="27px" maxW="calc(100vw - 70px)">
                        <Text noOfLines={1} maxW={{ base: '60%', md: '70%' }}>You will receive</Text>
                        <Text fontWeight={'700'}>{amountToSwap || '0'}</Text>

                        <HStack mt="44px" alignItems="center">
                            <Image
                                alt="coin logo"
                                boxSize="24px"
                                borderRadius="full"
                                src={selectedToken.logoURI}
                            />
                            <Text>{selectedToken.symbol}</Text>
                        </HStack>
                    </Wrap>


                    {account && <>
                        <HStack mt={3} alignItems={'center'}>
                            <Image
                                alt="coin logo"
                                boxSize="24px"
                                borderRadius="full"
                                src={selectedToken.logoURI}
                            />
                            <Text>Balance {parseFloat(ethers.utils.formatUnits(currency === 'SYS' ? balanceNativeTokenL2 : balanceERC20TokenL2,
                                selectedTokenDecimals
                            )).toFixed(6)} {selectedToken.symbol}</Text>
                        </HStack>
                    </>}

                </Flex>
            )}

            {/* {(account && selectedToken && selectedToken.symbol === 'SYS') && (<>
                <Flex flexDir={'column'} mt={4}>
                    <WarningInfoBlock warningText='In case if You want to use other provider instead of Standard Bridge for deposit SYS please click button below.'>
                        <Button variant={'primary'} onClick={() => onSelectBridgeProvider('SYS', true)}>
                            Select other provider
                        </Button>
                    </WarningInfoBlock>
                </Flex>

            </>)} */}

            <Flex
                mt={{ base: '32px', md: '44px' }}
                w="100%"
                __css={{
                    button: {
                        w: '100%'
                    }
                }}
            >
                {!account && (
                    <ConnectButton />
                )}

                {'SYS' !== currency && account && <>

                    <Flex flexDir={'row'} maxW={'100%'}>
                        <InfoIcon color={'orange.500'} height={6} marginRight={3} />
                        <Text size={'xl'}>
                            Allowance {ethers.utils.formatUnits(allowanceERC20Token || '0', selectedTokenDecimals)}
                        </Text>
                    </Flex>

                    {(typeof allowanceERC20Token === 'undefined' || allowanceERC20Token?.lt(ethers.utils.parseUnits(amountToSwap, selectedTokenDecimals))) && <>
                        <Button
                            variant="primary"
                            onClick={() => {
                                handleApproval();
                            }}
                        >
                            Approve
                        </Button>
                    </>}

                    {(allowanceERC20Token?.gte(ethers.utils.parseUnits(amountToSwap, selectedTokenDecimals)) && parseFloat(amountToSwap) > 0) && <>
                        <Button
                            variant="primary"
                            onClick={() => {
                                handleERC20Deposit()
                            }}
                        >
                            Deposit ERC20
                        </Button>
                    </>}
                </>}

                {('SYS' === currency && account && (chainId !== l1ChainId)) && <>
                    <Button
                        isDisabled={parseFloat(balanceToDisplay) < parseFloat(amountToSwap)}
                        variant="primary"
                        onClick={async () => {
                            const switchTarget = selectedNetwork === SelectedNetworkType.Unsupported ?
                                NEVMChain.chainId : l1ChainId;

                            await switchNetwork(switchTarget);
                        }}
                    >
                        Switch to {selectedNetwork === SelectedNetworkType.Mainnet ? 'Syscoin' : 'Tanenbaum'} Chain
                    </Button>
                </>}

                {('SYS' === currency && account && (chainId && chainId === l1ChainId)) && <>
                    <ReviewDeposit
                        amount={parseFloat(amountToSwap)}
                        coinName={currency}
                        gasFee={estimatedTxPrice.weiEstimate ?? 0}
                        isDepositLoading={showDepositSent}
                        depositTxHash={depositTx}
                        onOpenModal={() => {
                            setDepositTx(undefined);
                            setShowDepositSent(false);
                        }}
                        estimatedFiatFee={estimatedTxPrice.usdEstimate ?? 0}
                        isDisabled={parseFloat(balanceToDisplay) < parseFloat(amountToSwap) || !parseFloat(amountToSwap)}
                    >
                        <>



                            <Button
                                isLoading={showDepositSent || depositTx !== undefined}
                                width={'100%'}
                                loadingText="Depositing..."
                                variant="primary"
                                onClick={() => {
                                    setShowDepositSent(true);
                                    onClickDepositButton(amountToSwap);
                                }}
                            >
                                Deposit
                            </Button>
                        </>

                    </ReviewDeposit>

                </>}


                {parseFloat(amountToSwap) > 0 && <>
                    <HStack mt={4} spacing={4} justifyContent={'center'}>
                        <Text color={'gray.500'}>
                            <ChevronRightIcon /> Gas fee to transfer
                        </Text>
                        <Spacer />
                        <Skeleton isLoaded={estimatedTxPrice.usdEstimate !== undefined && estimatedTxPrice.weiEstimate !== undefined}>
                            <Text
                                color={'gray.500'}>
                                {estimatedTxPrice.weiEstimate?.toFixed(6)} SYS ( ~{estimatedTxPrice.usdEstimate?.toFixed(7)} $)
                            </Text>
                        </Skeleton>

                    </HStack>
                    <HStack mt={4} spacing={4} justifyContent={'center'}>
                        <Text color={'gray.500'}>
                            <RepeatClockIcon /> Time to transfer
                        </Text>
                        <Spacer />
                        <Skeleton isLoaded={estimatedTxPrice.usdEstimate !== undefined && estimatedTxPrice.weiEstimate !== undefined}>
                            <Text
                                color={'gray.500'}>
                                ~ 2-5 minutes
                            </Text>
                        </Skeleton>
                    </HStack>
                </>}

            </Flex>
        </Flex>
    )
}

export default DepositPart;