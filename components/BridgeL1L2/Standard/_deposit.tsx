import { ChevronDownIcon, ChevronRightIcon, InfoIcon, RepeatClockIcon } from '@chakra-ui/icons';
import {
    Button, Flex, FormControl, FormErrorMessage, FormLabel, HStack, Icon, IconButton, Image, Input, Menu,
    MenuButton, MenuItem, MenuList, NumberInput, NumberInputField, PlacementWithLogical, Skeleton, Spacer, Spinner, Text, useBreakpointValue, useToast, VStack, Wrap
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

export type DepositPartProps = {
    onClickDepositButton: (amount: string) => void;
    onClickApproveERC20: (l1Token: string, l2Token: string, amount: BigNumber) => void;
    onClickDepositERC20: (l1Token: string, l2Token: string, amount: BigNumber) => void;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    onSelectBridgeProvider: (provider: string, force: boolean) => void;
    onSwapDirection: () => void;
}

export const DepositPart: FC<DepositPartProps> = ({ onClickDepositButton, onClickApproveERC20, onClickDepositERC20, setIsLoading, onSelectBridgeProvider, onSwapDirection }) => {
    const [currency, setCurrency] = useState<string>('SYS');
    const [selectedTokenAddress, setSelectedTokenAddress] = useState<string | undefined>(undefined);
    const [selectedTokenAddressL2, setSelectedTokenAddressL2] = useState<string | undefined>(undefined);
    const [balanceToDisplay, setBalanceToDisplay] = useState<string>('');
    const [selectedTokenDecimals, setSelectedTokenDecimals] = useState<number>(18);
    const [amountToSwap, setAmountToSwap] = useState<string>('0.00');

    const { l1ChainId, l2ChainId, rpcL1, rpcL2, selectedNetwork, contractsL1 } = useSelectedNetwork();

    const { account, chainId, switchNetwork } = useEthers();
    const balanceNativeToken = useEtherBalance(account, { chainId: l1ChainId });
    const balanceERC20Token = useTokenBalance(selectedTokenAddress, account, { chainId: l1ChainId });
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
        { address: '', chainId: chainId, decimals: 18, name: 'Syscoin', symbol: 'SYS', logoURI: '/syscoin-logo.svg' }

    const messenger = useCrossChainMessenger();

    const { calculateEstimate } = useEstimateTransaction();
    useEffect(() => {
        if (parseFloat(amountToSwap) == 0 || !messenger) {
            return; // break here
        }

        setEstimatedTxPrice({
            usdEstimate: undefined,
            weiEstimate: undefined
        })

        const gasLimit = selectedTokenAddress !== undefined ?
            messenger.estimateGas.depositERC20(
                selectedTokenAddress ?? ethers.constants.AddressZero,
                selectedTokenAddressL2 ?? ethers.constants.AddressZero,
                ethers.utils.parseUnits(amountToSwap, selectedTokenDecimals)
            ) : messenger.estimateGas.depositETH(ethers.utils.parseUnits(amountToSwap, 18))

        gasLimit.then(async (gasLimit) => {
            const estimateResult = await calculateEstimate(
                gasLimit,
                1);

            if (estimateResult === undefined) {
                console.warn('Failed to estimate transaction price.');
                return;
            }

            setEstimatedTxPrice(estimateResult);
        });

    }, [messenger, amountToSwap, selectedTokenDecimals, selectedTokenAddress, selectedTokenAddressL2, calculateEstimate]);



    const viewTokenBalance = async (tokenAddress: string, decimals: number, owner: string): Promise<string> => {
        let ret: string = '0.00';

        try {
            const contract = new Contract(tokenAddress, ERC20Interface,
                new ethers.providers.StaticJsonRpcProvider(rpcL1)
            );

            const balance = await contract.balanceOf(owner);

            return ethers.utils.formatUnits(balance, decimals);

        } catch (e) {
            // console.warn("Could not fetch balance for token.");

            return ret;
        }
    }


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
                    viewTokenBalance(token.address, token.decimals, account).then((balance: string) => {
                        balancesInfo[token.symbol] = balance;
                    })
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
        <Flex flexDir="column">
            <FormControl isInvalid={ethers.utils.parseUnits(balanceToDisplay || '0', selectedTokenDecimals).lt(ethers.utils.parseUnits(amountToSwap || '0', selectedTokenDecimals))}>
                <Flex justifyContent="space-between">

                    <OtherProvidersMenuSelector preSelectLabel={'From'} onSelect={(provider) => onSelectBridgeProvider(provider, false)} />
                    <Spacer />
                    {
                        selectedToken && selectedToken?.symbol !== 'SYS' ?
                            <><Text textAlign={'right'} mr={3} opacity={.5}>Available {tokenBalancesMap?.[selectedToken.symbol] || '0.00'} </Text><MaxBalance onClick={() => {
                                setAmountToSwap(tokenBalancesMap?.[selectedToken.symbol] || '0.00');
                            }} /></> : selectedToken ?
                                <><Text textAlign={'right'} mr={3} opacity={.5}>Available {balanceNativeToken ? (+formatEther(balanceNativeToken)).toFixed(4) : '0.00'} </Text><MaxBalance onClick={() => {
                                    setAmountToSwap(balanceNativeToken ? formatEther(balanceNativeToken).toString() : '0.00');
                                }} /></> : <></>
                    }
                </Flex>
                <HStack bg="#f4fadb" borderRadius="6px" minH="48px" px="19px" border={parseFloat(balanceToDisplay) < parseFloat(amountToSwap) ? '2px solid' : 'none'} borderColor="red.400">
                    <NumberInput w={'100%'} value={amountToSwap} variant="unstyled" size="lg" onChange={(valueAsString) => {
                        if (valueAsString.length > 0 && parseFloat(valueAsString) > 0) {
                            setAmountToSwap(valueAsString)
                        } else {
                            setAmountToSwap('0.00');
                        }
                    }}>
                        <NumberInputField placeholder='0.00' />
                    </NumberInput>
                    <Spacer />
                    <Menu isLazy lazyBehavior="unmount" placement="top-start" autoSelect={false}>
                        <MenuButton minW="fit-content">
                            <HStack>
                                {
                                    selectedToken && (
                                        <>
                                            <Image
                                                borderRadius="full"
                                                src={selectedToken.logoURI}
                                                alt={`${selectedToken.name} logo`}
                                                boxSize="6"
                                            />
                                            <Text>
                                                {selectedToken ? selectedToken.symbol : ''}
                                            </Text>
                                        </>
                                    )
                                }
                                <ChevronDownIcon fontSize="xl" />
                            </HStack>
                        </MenuButton>

                        <MenuList maxH="300px" overflow="scroll" position="absolute" left="-100px" top="50px">
                            <MenuItem
                                onClick={() => setCurrency('SYS')}
                            >
                                <HStack>
                                    <Image
                                        borderRadius="full"
                                        src="/syscoin-logo.svg"
                                        alt={`SYS logo`}
                                        boxSize="6"
                                    />
                                    <Text>SYS</Text>
                                </HStack>
                            </MenuItem>
                            {l1ERC20Tokens?.map((token) => (
                                <MenuItem
                                    key={token.address + token.name}
                                    onClick={() => setCurrency(token.symbol)}
                                >
                                    <HStack>
                                        <Image
                                            borderRadius="full"
                                            src={token.logoURI}
                                            alt={`${token.name} logo`}
                                            boxSize="6"
                                        />
                                        <Text>{token.name}</Text>
                                    </HStack>
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                </HStack>

                <FormErrorMessage>Invalid amount</FormErrorMessage>
            </FormControl>
            <DirectionSwitcherArrow onClick={onSwapDirection} />
            {selectedToken && (
                <Flex flexDir="column" maxW="100%">
                    <Text fontWeight={700} mt={{ base: '24px', md: '44px' }} ml={2}>
                        You will get on Rollux
                    </Text>

                    <Wrap alignItems="center" mt="15px" spacing="27px" maxW="calc(100vw - 70px)" ml={2}>
                        <Text noOfLines={1} maxW={{ base: '60%', md: '70%' }}>{amountToSwap}</Text>

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
                </Flex>
            )}

            {(account && selectedToken && selectedToken.symbol === 'SYS') && (<>
                <Flex flexDir={'column'} mt={4}>
                    <WarningInfoBlock warningText='In case if You want to use other provider instead of Standard Bridge for deposit SYS please click button below.'>
                        <Button variant={'primary'} onClick={() => onSelectBridgeProvider('SYS', true)}>
                            Select other provider
                        </Button>
                    </WarningInfoBlock>
                </Flex>

            </>)}

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
                        isDisabled={parseFloat(balanceToDisplay) < parseFloat(amountToSwap) || !parseFloat(amountToSwap)}
                    >
                        <Button
                            width={'100%'}
                            variant="primary"
                            onClick={() => {
                                onClickDepositButton(amountToSwap);
                            }}
                        >
                            Deposit
                        </Button>
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
                        <Text
                            color={'gray.500'}>
                            ~ 2-5 minutes
                        </Text>
                    </HStack>
                </>}

            </Flex>
        </Flex>
    )
}

export default DepositPart;