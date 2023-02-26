import { Box, Button, Card, CardContent, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useEtherBalance, useEthers, useTokenAllowance, useTokenBalance } from '@usedapp/core';
import { TokenInfo } from 'hooks/Common/useERC20TokenList';
import { useERC20TokenList } from 'hooks/Common/useERC20TokenList';
import React, { FC, useEffect, useState } from 'react'
import { BigNumber, ethers } from 'ethers';
import { fetchERC20TokenList } from 'blockchain/NevmRolluxBridge/fetchers/ERC20TokenList';
import TokenListToken from 'blockchain/NevmRolluxBridge/interfaces/TokenListToken';

export type DepositPartProps = {
    onClickDepositButton: (amount: string, tokenAddress: string | undefined) => void;
    L1StandardBridgeAddress: string,
}

export const DepositPart: FC<DepositPartProps> = ({ onClickDepositButton, L1StandardBridgeAddress }) => {
    const [currency, setCurrency] = useState<string>('');
    const [selectedTokenAddress, setSelectedTokenAddress] = useState<string | undefined>(undefined);
    const [balanceToDisplay, setBalanceToDisplay] = useState<string>('');
    const [selectedTokenDecimals, setSelectedTokenDecimals] = useState<number>(18);
    const [youWillGetAmount, setYouWillGetAmount] = useState<string>('0.00');
    const [amountToSwap, setAmountToSwap] = useState<string>('0.00');
    const tokens = useERC20TokenList();
    const { account } = useEthers();

    const balanceNativeToken = useEtherBalance(account);
    const balanceERC20Token = useTokenBalance(selectedTokenAddress, account);
    const allowanceERC20Token = useTokenAllowance(selectedTokenAddress, account, L1StandardBridgeAddress);
    const [allERC20Tokens, setAllERC20Tokens] = useState<TokenListToken[]>([]);
    const [l1ERC20Tokens, setL1ERC20Tokens] = useState<TokenListToken[]>([]);
    // balance hook




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
        }

    }, [currency, l1ERC20Tokens]);


    /** load tokens hook */
    useEffect(() => {
        fetchERC20TokenList().then((tokens) => {
            const tokensL1: TokenListToken[] = tokens.filter((token) => {
                if (token.chainId === 5700) {
                    return true;
                }

                return false;
            })

            setL1ERC20Tokens(tokensL1);
        })
    }, []);


    return (
        <>
            <Box component={Container} sx={{ alignItems: 'center', my: '3' }}>
                <Card>
                    <CardContent>
                        <Box component={Container}>
                            <Typography variant='h6'>
                                From Syscoin NEVM
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
                                            onChange={(event) => setAmountToSwap(event.target.value)}
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
                                                <em>SYS</em>
                                            </MenuItem>

                                            {(l1ERC20Tokens && l1ERC20Tokens.length > 0) &&
                                                l1ERC20Tokens.map((value, index: number) => {
                                                    return <MenuItem selected={value.symbol === currency} onClick={(e) => setCurrency(value.symbol)} value={value.symbol} key={index}>
                                                        <em>{value.symbol}</em>
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
                                            onClick={() => {
                                                onClickDepositButton(amountToSwap, undefined);
                                            }}
                                            sx={{ width: 1 }}
                                        >
                                            Deposit
                                        </Button>
                                    </>}

                                    {'SYS' !== currency && <>
                                        {typeof allowanceERC20Token === 'undefined' && <>
                                            <Button
                                                variant='outlined'
                                                size='large'
                                                color='error'
                                                sx={{ width: 1 }}
                                                disabled
                                            >
                                                Token error
                                            </Button>
                                        </>}


                                        {allowanceERC20Token?.lt(ethers.utils.parseEther(amountToSwap)) && <>
                                            <Button
                                                variant='outlined'
                                                size='large'
                                                color='secondary'
                                                sx={{ width: 1 }}
                                            >
                                                Approve
                                            </Button>
                                        </>}

                                        {allowanceERC20Token?.gte(ethers.utils.parseEther(amountToSwap)) && <>
                                            <Button
                                                variant='contained'
                                                size='large'
                                                color='secondary'
                                                sx={{ width: 1 }}
                                                onClick={() => {
                                                    onClickDepositButton(amountToSwap, selectedTokenAddress);
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

export default DepositPart;