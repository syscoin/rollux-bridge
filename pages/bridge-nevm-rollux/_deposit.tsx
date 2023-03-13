import { ChevronDownIcon } from '@chakra-ui/icons';
import {
    Button, Flex, FormControl, FormErrorMessage, FormLabel, HStack, Image, Input, Menu,
    MenuButton, MenuItem, MenuList, NumberInput, NumberInputField, PlacementWithLogical, Text, useBreakpointValue, Wrap
} from '@chakra-ui/react';
import { ERC20Interface, useEtherBalance, useEthers, useTokenAllowance, useTokenBalance } from '@usedapp/core';
import { TanenbaumChain } from 'blockchain/NevmRolluxBridge/config/chainsUseDapp';
import { fetchERC20TokenList } from 'blockchain/NevmRolluxBridge/fetchers/ERC20TokenList';
import TokenListToken from 'blockchain/NevmRolluxBridge/interfaces/TokenListToken';
import { ConnectionWarning } from 'components/ConnectionWarning';
import { BigNumber, Contract, ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import React, { FC, useEffect, useState } from 'react';

export type DepositPartProps = {
    onClickDepositButton: (amount: string, tokenAddress: string | undefined) => void;
    onClickApproveERC20: (l1Token: string, l2Token: string, amount: BigNumber) => void;
    onClickDepositERC20: (l1Token: string, l2Token: string, amount: BigNumber) => void;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    L1StandardBridgeAddress: string,
}

export const DepositPart: FC<DepositPartProps> = ({ onClickDepositButton, onClickApproveERC20, onClickDepositERC20, setIsLoading, L1StandardBridgeAddress }) => {
    const [currency, setCurrency] = useState<string>('SYS');
    const [selectedTokenAddress, setSelectedTokenAddress] = useState<string | undefined>(undefined);
    const [selectedTokenAddressL2, setSelectedTokenAddressL2] = useState<string | undefined>(undefined);
    const [balanceToDisplay, setBalanceToDisplay] = useState<string>('');
    const [selectedTokenDecimals, setSelectedTokenDecimals] = useState<number>(18);
    const [youWillGetAmount, setYouWillGetAmount] = useState<string>('0.00');
    const [amountToSwap, setAmountToSwap] = useState<string>('0.00');
    const { account, chainId, switchNetwork } = useEthers();

    const balanceNativeToken = useEtherBalance(account, { chainId: TanenbaumChain.chainId });
    const balanceERC20Token = useTokenBalance(selectedTokenAddress, account, { chainId: TanenbaumChain.chainId });
    const allowanceERC20Token = useTokenAllowance(selectedTokenAddress, account, L1StandardBridgeAddress, {
        chainId: TanenbaumChain.chainId
    });
    const [allERC20Tokens, setAllERC20Tokens] = useState<TokenListToken[]>([]);
    const [l1ERC20Tokens, setL1ERC20Tokens] = useState<TokenListToken[]>([]);
    const [l2ERC20Tokens, setL2ERC20Tokens] = useState<TokenListToken[]>([]);

    const [tokenBalancesMap, setTokenBalancesMap] = useState<{ [key: string]: string }>({});

    const selectedToken = currency !== 'SYS' ?
        l1ERC20Tokens?.find(token => token.symbol === currency) :
        { address: '', chainId: chainId, decimals: 18, name: 'Syscoin', symbol: 'SYS', logoURI: '/syscoin-logo.svg' }

    const viewTokenBalance = async (tokenAddress: string, decimals: number, owner: string): Promise<string> => {
        let ret: string = '0.00';

        try {
            const contract = new Contract(tokenAddress, ERC20Interface,
                new ethers.providers.StaticJsonRpcProvider(TanenbaumChain.rpcUrl)
            );

            const balance = await contract.balanceOf(owner);

            return ethers.utils.formatUnits(balance, decimals);

        } catch (e) {
            // console.warn("Could not fetch balance for token.");

            return ret;
        }
    }


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
        setIsLoading(true);

        fetchERC20TokenList().then((tokens) => {
            const tokensL1: TokenListToken[] = tokens.filter((token) => {
                if (token.chainId === 5700) {
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
                if (token.chainId === 57000) {
                    return true;
                }

                return false;
            })

            setL2ERC20Tokens(tokensL2);


            // set all tokens

            setAllERC20Tokens(tokens);

            setIsLoading(false);
        })
    }, [setIsLoading, account]);

    const handleApproval = async () => {
        if (selectedTokenAddress && selectedTokenAddressL2) {

            await preCheckNetwork(TanenbaumChain.chainId, chainId as number);

            setIsLoading(true);
            onClickApproveERC20(selectedTokenAddress, selectedTokenAddressL2, ethers.utils.parseEther(amountToSwap));
        }
    }

    const handleERC20Deposit = async () => {
        if (selectedTokenAddress && selectedTokenAddressL2) {

            await preCheckNetwork(TanenbaumChain.chainId, chainId as number);

            setIsLoading(true);
            onClickDepositERC20(selectedTokenAddress, selectedTokenAddressL2, ethers.utils.parseEther(amountToSwap));
        }
    }


    return (
        <Flex flexDir="column">
            <FormControl isInvalid={parseFloat(balanceToDisplay) < parseFloat(amountToSwap)}>
                <Flex justifyContent="space-between">
                    <FormLabel fontWeight="700">
                        From Syscoin NEVM
                    </FormLabel>

                    {
                        selectedToken && selectedToken?.symbol !== 'SYS' ?
                            <Text opacity={.5}>Available {tokenBalancesMap?.[selectedToken.symbol] || '0.00'}</Text> : selectedToken ?
                                <Text opacity={.5}>Available {balanceNativeToken ? (+formatEther(balanceNativeToken)).toFixed(4) : '0.00'}</Text> : <></>
                    }
                </Flex>
                <HStack bg="#f4fadb" borderRadius="6px" minH="48px" px="19px" border={parseFloat(balanceToDisplay) < parseFloat(amountToSwap) ? '2px solid' : 'none'} borderColor="red.400">
                    <NumberInput variant="unstyled" size="lg" onChange={(valueAsString) => {
                        if (valueAsString.length > 0) {
                            setAmountToSwap(valueAsString)
                        } else {
                            setAmountToSwap('0.00');
                        }
                    }}>
                        <NumberInputField placeholder='0.00' />
                    </NumberInput>

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

            {selectedToken && (
                <Flex flexDir="column" maxW="100%">
                    <Text fontWeight={700} mt={{ base: '24px', md: '44px' }}>
                        You will get on Rollux
                    </Text>

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

            <Flex
                mt={{ base: '32px', md: '44px' }}
                w="100%"
                __css={{
                    button: {
                        w: '100%',
                        textAlign: 'center !important',
                        background:
                            'linear-gradient(90.06deg, #DBEF88 -3.26%, #EACF5E 207.26%) !important',
                    },
                }}
            >
                {!account && (
                    <Button bg="linear-gradient(90.06deg, #DBEF88 -3.26%, #EACF5E 207.26%)">Connect Wallet</Button>
                )}

                {'SYS' !== currency && account && <>
                    {(typeof allowanceERC20Token === 'undefined' || allowanceERC20Token?.lt(ethers.utils.parseEther(amountToSwap))) && <>
                        <Button
                            bg="linear-gradient(90.06deg, #DBEF88 -3.26%, #EACF5E 207.26%)"
                            onClick={() => handleApproval()}
                        >
                            Approve
                        </Button>
                    </>}

                    {(allowanceERC20Token?.gte(ethers.utils.parseEther(amountToSwap)) && parseFloat(amountToSwap) > 0) && <>
                        <Button
                            bg="linear-gradient(90.06deg, #DBEF88 -3.26%, #EACF5E 207.26%)"
                            onClick={() => {
                                handleERC20Deposit()
                            }}
                        >
                            Deposit ERC20
                        </Button>
                    </>}
                </>}

                {('SYS' === currency && (chainId !== TanenbaumChain.chainId)) && <>
                    <Button
                        isDisabled={parseFloat(balanceToDisplay) < parseFloat(amountToSwap)}
                        bg="linear-gradient(90.06deg, #DBEF88 -3.26%, #EACF5E 207.26%)"
                        onClick={async () => {
                            await switchNetwork(TanenbaumChain.chainId);
                        }}
                    >
                        Switch to Tanenbaum Chain
                    </Button>
                </>}

                {('SYS' === currency && account && (chainId && chainId === TanenbaumChain.chainId)) && <>
                    <Button
                        isDisabled={parseFloat(balanceToDisplay) < parseFloat(amountToSwap) || !parseFloat(amountToSwap)}
                        bg="linear-gradient(90.06deg, #DBEF88 -3.26%, #EACF5E 207.26%)"
                        onClick={() => {
                            onClickDepositButton(amountToSwap, undefined);
                        }}
                    >
                        Deposit
                    </Button>
                </>}
            </Flex>            
        </Flex>
    )
}

export default DepositPart;