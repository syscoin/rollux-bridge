import { ChevronDownIcon } from '@chakra-ui/icons';
import {
    Box,
    Button, Flex, FormControl, FormErrorMessage, FormLabel, HStack, Image, Input, Menu,
    MenuButton, MenuItem, MenuList, NumberInput, NumberInputField, PlacementWithLogical, Spacer, Text, useBreakpointValue, Wrap
} from '@chakra-ui/react';
import { ERC20Interface, useEtherBalance, useEthers, useTokenAllowance, useTokenBalance } from '@usedapp/core';
import { fetchERC20TokenList } from 'blockchain/NevmRolluxBridge/fetchers/ERC20TokenList';
import TokenListToken from 'blockchain/NevmRolluxBridge/interfaces/TokenListToken';
import { ConnectButton } from 'components/ConnectButton';
import { OtherProvidersMenuSelector } from 'components/BridgeL1L2/OtherProviders/OtherProvidersMenuSelector';
import { BigNumber, Contract, ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import React, { FC, useEffect, useState } from 'react';
import { useSelectedNetwork } from 'hooks/rolluxBridge/useSelectedNetwork';
import WarningInfoBlock from 'components/Common/WarningInfoBlock';
import { DirectionSwitcherArrow } from '../DirectionSwitcherArrow';
import SelectTokenModal from './SelectTokenModal';

export type WithdrawPartProps = {
    onClickWithdrawButton: (amount: string) => void;
    onClickWithdrawERC20: (l1Token: string, l2Token: string, amount: BigNumber) => void;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    onSelectBridgeProvider: (provider: string, force: boolean) => void;
    onSwapDirection: () => void;
}

export const WithdrawPart: FC<WithdrawPartProps> = ({ onClickWithdrawButton, onClickWithdrawERC20, setIsLoading, onSelectBridgeProvider, onSwapDirection }) => {
    const [currency, setCurrency] = useState<string>('SYS');
    const [selectedTokenAddress, setSelectedTokenAddress] = useState<string | undefined>(undefined);
    const [selectedTokenAddressL2, setSelectedTokenAddressL2] = useState<string | undefined>(undefined);
    const [balanceToDisplay, setBalanceToDisplay] = useState<string>('');
    const [selectedTokenDecimals, setSelectedTokenDecimals] = useState<number>(18);
    const [amountToSwap, setAmountToSwap] = useState<string>('0.00');
    const { account, chainId, switchNetwork } = useEthers();
    const { l1ChainId, l2ChainId, rpcL1, rpcL2, selectedNetwork } = useSelectedNetwork();

    const balanceNativeToken = useEtherBalance(account, { chainId: l2ChainId });
    const balanceERC20Token = useTokenBalance(selectedTokenAddress, account, { chainId: l2ChainId });
    const [allERC20Tokens, setAllERC20Tokens] = useState<TokenListToken[]>([]);
    const [l1ERC20Tokens, setL1ERC20Tokens] = useState<TokenListToken[]>([]);
    const [l2ERC20Tokens, setL2ERC20Tokens] = useState<TokenListToken[]>([]);

    const selectedToken = currency !== 'SYS' ?
        l2ERC20Tokens?.find(token => token.symbol === currency) :
        { address: '', chainId: l2ChainId, decimals: 18, name: 'Syscoin', symbol: 'SYS', logoURI: '/syscoin-logo.svg' }


    const [outputNetwork, setOutputNetwork] = useState<string>('SYS');

    // balance hook

    const preCheckNetwork = async (neededNetwork: number, chainId: number) => {
        if (chainId !== neededNetwork) {
            await switchNetwork(neededNetwork);
        }
    }


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

        l2ERC20Tokens.forEach((value) => {
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

            l1ERC20Tokens.forEach((value) => {
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
        setIsLoading(true);

        fetchERC20TokenList().then((tokens) => {
            const tokensL1: TokenListToken[] = tokens.filter((token) => {
                if (token.chainId === l1ChainId) {
                    return true;
                }

                return false;
            })

            setL1ERC20Tokens(tokensL1);


            const tokensL2: TokenListToken[] = tokens.filter((token) => {
                if (token.chainId === l2ChainId) {
                    return true;
                }

                return false;
            })

            setL2ERC20Tokens(tokensL2);

            setAllERC20Tokens(tokens);

            setIsLoading(false);
        })
    }, [setIsLoading, account, l1ChainId, l2ChainId]);


    const handleERC20Withdraw = async () => {
        if (selectedTokenAddress && selectedTokenAddressL2) {

            await preCheckNetwork(l2ChainId, chainId as number);

            setIsLoading(true);
            onClickWithdrawERC20(selectedTokenAddressL2, selectedTokenAddress, ethers.utils.parseUnits(amountToSwap, selectedTokenDecimals));
        }
    }



    return (
        <Flex flexDir="column">
            <FormControl isInvalid={ethers.utils.parseUnits(balanceToDisplay || '0', selectedTokenDecimals).lt(ethers.utils.parseUnits(amountToSwap || '0', selectedTokenDecimals))}>
                <Flex justifyContent="space-between">
                    <FormLabel fontWeight="700">
                        From Rollux
                    </FormLabel>

                    {
                        selectedToken && selectedToken?.symbol !== 'SYS' ?
                            <Text opacity={.5}>Available {parseFloat(ethers.utils.formatUnits(balanceERC20Token || BigNumber.from('0'), selectedTokenDecimals)).toFixed(2) || '0.00'}</Text> : selectedToken ?
                                <Text opacity={.5}>Available {balanceNativeToken ? (+formatEther(balanceNativeToken)).toFixed(4) : '0.00'}</Text> : <></>
                    }
                </Flex>
                <HStack bg="#f4fadb" borderRadius="6px" minH="48px" px="19px" border={ethers.utils.parseUnits(balanceToDisplay || '0', selectedTokenDecimals).lt(ethers.utils.parseUnits(amountToSwap || '0', selectedTokenDecimals)) ? '2px solid' : 'none'} borderColor="red.400">
                    <NumberInput variant="unstyled" size="lg" onChange={(valueAsString) => {
                        if (valueAsString.length > 0 && parseFloat(valueAsString) > 0) {
                            setAmountToSwap(valueAsString)
                        } else {
                            setAmountToSwap('0.00');
                        }
                    }}>
                        <NumberInputField placeholder='0.00' />
                    </NumberInput>

                    {/* <Menu isLazy lazyBehavior="unmount" placement="top-start" autoSelect={false}>
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
                            {l2ERC20Tokens?.map((token) => (
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
                    </Menu> */}
                    <Spacer />
                    <SelectTokenModal
                        tokens={l2ERC20Tokens}
                        onSelect={(token) => {
                            console.log(token);
                            setCurrency(token.symbol);
                            setAmountToSwap('0.00');
                        }}
                        chainId={l2ChainId}
                        selectedToken={selectedToken !== undefined ? selectedToken : { address: '', chainId: l1ChainId, decimals: 18, name: 'Syscoin', symbol: 'SYS', logoURI: '/syscoin-logo.svg' }}
                    />
                </HStack>

                <FormErrorMessage>Invalid amount</FormErrorMessage>
            </FormControl>
            <DirectionSwitcherArrow onClick={onSwapDirection} />
            {selectedToken && (
                <Flex flexDir="column" maxW="100%">
                    <Box sx={{ mt: { base: '24px', md: '44px' } }}>
                        <OtherProvidersMenuSelector preSelectLabel={'You will get on '} onSelect={(provider) => {
                            setOutputNetwork(provider);
                            onSelectBridgeProvider(provider, false);
                        }} />
                    </Box>

                    <Wrap alignItems="center" mt="15px" spacing="27px" maxW="calc(100vw - 70px)">
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

            {(account && selectedToken && outputNetwork === 'SYS') && (<>
                <Flex flexDir={'column'} mt={4}>
                    <WarningInfoBlock warningText='In case if You want to use other provider instead of Standard Bridge for withdraw SYS or tokens please click button below.'>
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
                        w: '100%',
                    },
                }}
            >
                {!account && (
                    <ConnectButton />
                )}

                {('SYS' !== currency && account) && <>

                    {((balanceERC20Token && balanceERC20Token.gte(ethers.utils.parseUnits(amountToSwap, selectedTokenDecimals)))) && <>
                        <Button
                            variant="primary"
                            onClick={() => {
                                handleERC20Withdraw()
                            }}
                        >
                            {chainId !== l2ChainId && 'Switch to Rollux'}
                            {chainId === l2ChainId && 'Withdraw'}
                        </Button>
                    </>}
                </>}

                {('SYS' === currency && account && (chainId !== l2ChainId)) && <>
                    <Button
                        isDisabled={ethers.utils.parseUnits(balanceToDisplay || '0', selectedTokenDecimals).lt(ethers.utils.parseUnits(amountToSwap || '0', selectedTokenDecimals))}
                        variant="primary"
                        onClick={async () => {
                            await switchNetwork(l2ChainId);
                        }}
                    >
                        Switch to Rollux Chain
                    </Button>
                </>}

                {('SYS' === currency && account && (chainId && chainId === l2ChainId)) && <>
                    <Button
                        isDisabled={ethers.utils.parseUnits(balanceToDisplay || '0', selectedTokenDecimals).lt(ethers.utils.parseUnits(amountToSwap || '0', selectedTokenDecimals))}
                        variant="primary"
                        onClick={async () => {
                            await preCheckNetwork(l2ChainId, chainId as number);
                            onClickWithdrawButton(amountToSwap);
                        }}
                    >
                        Withdraw
                    </Button>
                </>}
            </Flex>
        </Flex >
    )
}

export default WithdrawPart;
