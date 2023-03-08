import { Box, Button, Card, CardContent, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { ChainId, ERC20Interface, useEtherBalance, useEthers, useTokenAllowance, useTokenBalance } from '@usedapp/core';
import { TokenInfo } from 'hooks/Common/useERC20TokenList';
import { useERC20TokenList } from 'hooks/Common/useERC20TokenList';
import React, { FC, useEffect, useState } from 'react'
import { BigNumber, Contract, ethers } from 'ethers';
import { fetchERC20TokenList } from 'blockchain/NevmRolluxBridge/fetchers/ERC20TokenList';
import TokenListToken from 'blockchain/NevmRolluxBridge/interfaces/TokenListToken';
import { RolluxChain, TanenbaumChain } from 'blockchain/NevmRolluxBridge/config/chainsUseDapp';
import Image from 'next/image';

export type WithdrawPartProps = {
    onClickWithdrawButton: (amount: string) => void;
    onClickApproveERC20: (l1Token: string, l2Token: string, amount: BigNumber) => void;
    onClickWithdrawERC20: (l1Token: string, l2Token: string, amount: BigNumber) => void;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    L1StandardBridgeAddress: string,
}

export const WithdrawPart: FC<WithdrawPartProps> = ({ onClickWithdrawButton, onClickApproveERC20, onClickWithdrawERC20, setIsLoading, L1StandardBridgeAddress }) => {
    const [currency, setCurrency] = useState<string>('');
    const [selectedTokenAddress, setSelectedTokenAddress] = useState<string | undefined>(undefined);
    const [selectedTokenAddressL2, setSelectedTokenAddressL2] = useState<string | undefined>(undefined);
    const [balanceToDisplay, setBalanceToDisplay] = useState<string>('');
    const [selectedTokenDecimals, setSelectedTokenDecimals] = useState<number>(18);
    const [youWillGetAmount, setYouWillGetAmount] = useState<string>('0.00');
    const [amountToSwap, setAmountToSwap] = useState<string>('0.00');
    const { account, chainId, switchNetwork } = useEthers();

    const balanceNativeToken = useEtherBalance(account, { chainId: RolluxChain.chainId });
    const balanceERC20Token = useTokenBalance(selectedTokenAddress, account, { chainId: RolluxChain.chainId });
    const allowanceERC20Token = useTokenAllowance(selectedTokenAddress, account, L1StandardBridgeAddress, {
        chainId: RolluxChain.chainId
    });
    const [allERC20Tokens, setAllERC20Tokens] = useState<TokenListToken[]>([]);
    const [l1ERC20Tokens, setL1ERC20Tokens] = useState<TokenListToken[]>([]);
    const [l2ERC20Tokens, setL2ERC20Tokens] = useState<TokenListToken[]>([]);

    const [tokenBalancesMap, setTokenBalancesMap] = useState<{ [key: string]: string }>({});


    const viewTokenBalance = async (tokenAddress: string, decimals: number, owner: string): Promise<string> => {
        let ret: string = '0.00';

        try {
            const contract = new Contract(tokenAddress, ERC20Interface,
                new ethers.providers.StaticJsonRpcProvider(RolluxChain.rpcUrl)
            );

            const balance = await contract.balanceOf(owner);

            return ethers.utils.formatUnits(balance, decimals);

        } catch (e) {
            // console.warn("Could not fetch balance for token.");
            // console.warn(e);

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
                if (token.chainId === 5700) {
                    return true;
                }

                return false;
            })

            setL1ERC20Tokens(tokensL1);


            const tokensL2: TokenListToken[] = tokens.filter((token) => {
                if (token.chainId === 57000) {
                    return true;
                }

                return false;
            })

            setL2ERC20Tokens(tokensL2);

            if (account) {
                /**
                 * balances mapping
                 */

                const balancesInfo: { [key: string]: string } = {};

                tokensL2.forEach((token) => {
                    viewTokenBalance(token.address, token.decimals, account).then((balance: string) => {
                        balancesInfo[token.symbol] = balance;
                    })
                })

                setTokenBalancesMap(balancesInfo);
            }


            // set all tokens

            setAllERC20Tokens(tokens);

            setIsLoading(false);
        })
    }, [setIsLoading, account]);

    const handleApproval = async () => {
        if (selectedTokenAddress && selectedTokenAddressL2) {

            await preCheckNetwork(RolluxChain.chainId, chainId as number);

            setIsLoading(true);
            onClickApproveERC20(selectedTokenAddress, selectedTokenAddressL2, ethers.utils.parseEther(amountToSwap));
        }
    }

    const handleERC20Withdraw = async () => {
        if (selectedTokenAddress && selectedTokenAddressL2) {

            await preCheckNetwork(RolluxChain.chainId, chainId as number);

            setIsLoading(true);
            onClickWithdrawERC20(selectedTokenAddress, selectedTokenAddressL2, ethers.utils.parseEther(amountToSwap));
        }
    }





    return (
        <>
            <Box component={Container} sx={{ alignItems: 'center', my: '3' }}>
                <Card>
                    <CardContent>
                        <Box component={Container}>
                            <Typography variant='h6'>
                                From Rollux
                            </Typography>
                        </Box>


                        <Box component={Container} sx={{ my: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={7}>
                                    <FormControl fullWidth>
                                        <TextField
                                            error={parseFloat(balanceToDisplay) < parseFloat(amountToSwap)}
                                            label={'Amount'}
                                            helperText={balanceToDisplay !== '' ? `${balanceToDisplay} available` : undefined}
                                            id="currency_amount_input"
                                            fullWidth variant='outlined'
                                            type='number'
                                            onChange={(event) => {
                                                if (event.target.value.length > 0) {
                                                    setAmountToSwap(event.target.value)
                                                } else {
                                                    setAmountToSwap('0.00');
                                                }

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={5}>
                                    <FormControl fullWidth>
                                        <InputLabel id="currency_select_label" htmlFor='currency_select'> Select currency </InputLabel>
                                        <Select
                                            labelId='currency_select_label'
                                            id='currency_select'
                                            label="Select currency"
                                            value={currency}
                                        >
                                            <MenuItem value="SYS" selected={'SYS' === currency} onClick={() => setCurrency("SYS")}>
                                                <Container sx={{ display: 'flex', alignItems: 'left' }}>

                                                    <Box sx={{ width: 20, height: 20 }}>
                                                        <Image src="/syscoin-logo.svg" alt='logo' width={'20px'} height={'20px'} />
                                                    </Box>
                                                    <Typography variant="body1" sx={{ ml: 1 }}>
                                                        SYS {balanceNativeToken ? ethers.utils.formatEther(balanceNativeToken) : '0.00'}
                                                    </Typography>
                                                </Container>
                                            </MenuItem>

                                            {(l2ERC20Tokens && l2ERC20Tokens.length > 0) &&
                                                l2ERC20Tokens.map((value, index: number) => {

                                                    return <MenuItem selected={value.symbol === currency} onClick={(e) => setCurrency(value.symbol)} value={value.symbol} key={index}>
                                                        <Container sx={{ display: 'flex', alignItems: 'left' }}>

                                                            <Box sx={{ width: 20, height: 20 }}>
                                                                <Image src={value.logoURI} alt='logo' width={'20px'} height={'20px'} />
                                                            </Box>
                                                            <Typography variant="body1" sx={{ ml: 1 }}>
                                                                {value.symbol} {tokenBalancesMap[value.symbol]}
                                                            </Typography>
                                                        </Container>
                                                    </MenuItem>
                                                })
                                            }

                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Box >

            <Box component={Container} sx={{ alignItems: 'center', mt: 4 }}>
                <Card>
                    <CardContent>
                        <Box component={Container}>
                            <Typography variant='h6'>
                                You will get
                            </Typography>
                        </Box>


                        <Box component={Container} sx={{ my: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={7}>
                                    <FormControl fullWidth>
                                        <TextField
                                            helperText={currency}
                                            disabled
                                            id="currency_amount_input"
                                            error={parseFloat(balanceToDisplay) < parseFloat(amountToSwap)}
                                            fullWidth
                                            value={amountToSwap}
                                            variant='outlined'
                                            onChange={(event) => console.log(event.target.value)}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={5}>
                                    {'SYS' === currency && <>
                                        <Button
                                            disabled={parseFloat(balanceToDisplay) < parseFloat(amountToSwap)}
                                            variant='contained'
                                            size='large'
                                            color='success'
                                            onClick={async () => {
                                                await preCheckNetwork(RolluxChain.chainId, chainId as number);
                                                onClickWithdrawButton(amountToSwap);
                                            }}
                                            sx={{ width: 1 }}
                                        >
                                            Withdraw
                                        </Button>
                                    </>}

                                    {'SYS' !== currency && <>




                                        {(typeof allowanceERC20Token === 'undefined' || allowanceERC20Token?.lt(ethers.utils.parseEther(amountToSwap))) && <>
                                            <Button
                                                variant='outlined'
                                                size='large'
                                                color='secondary'
                                                sx={{ width: 1 }}
                                                onClick={() => handleApproval()}
                                            >
                                                Approve
                                            </Button>
                                        </>}

                                        {(allowanceERC20Token?.gte(ethers.utils.parseEther(amountToSwap)) && parseFloat(amountToSwap) > 0) && <>
                                            <Button
                                                variant='contained'
                                                size='large'
                                                color='secondary'
                                                sx={{ width: 1 }}
                                                onClick={async () => {
                                                    handleERC20Withdraw()
                                                }}
                                            >
                                                Deposit ERC20
                                            </Button>
                                        </>}
                                    </>}

                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Box >

        </>
    )
}

export default WithdrawPart;