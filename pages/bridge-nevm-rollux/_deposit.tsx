import { Box, Button, Card, CardContent, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useEtherBalance, useEthers, useTokenBalance } from '@usedapp/core';
import { TokenInfo } from 'hooks/Common/useERC20TokenList';
import { useERC20TokenList } from 'hooks/Common/useERC20TokenList';
import React, { FC, useEffect, useState } from 'react'
import { ethers } from 'ethers';

export const DepositPart: FC<{}> = () => {
    const [currency, setCurrency] = useState<string>('');
    const [selectedTokenAddress, setSelectedTokenAddress] = useState<string | undefined>(undefined);
    const [balanceToDisplay, setBalanceToDisplay] = useState<string>('');
    const [selectedTokenDecimals, setSelectedTokenDecimals] = useState<number>(18);
    const tokens = useERC20TokenList();
    const { account } = useEthers();

    const balanceNativeToken = useEtherBalance(account);
    const balanceERC20Token = useTokenBalance(selectedTokenAddress, account);

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


        let findToken: TokenInfo | undefined = undefined;

        tokens.forEach((value) => {
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

    }, [currency, tokens]);

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
                                        <TextField placeholder={balanceToDisplay ?? '0'} label={'Amount'} id="currency_amount_input" fullWidth variant='outlined' onChange={(event) => console.log(event.target.value)} />
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

                                            {(tokens && tokens.length > 0) &&
                                                tokens.map((value, index: number) => {
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
                                        <TextField disabled id="currency_amount_input" label="Amount of" fullWidth variant='outlined' onChange={(event) => console.log(event.target.value)} />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={5}>
                                    <Card variant="outlined" sx={{ width: 1 }}>
                                        <CardContent>
                                            <Typography variant='h5'>
                                                ~ SYS
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Box >

        </>
    )
}