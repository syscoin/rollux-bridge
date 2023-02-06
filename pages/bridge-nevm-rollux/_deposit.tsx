import { Box, Button, Card, CardContent, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useERC20TokenList } from 'hooks/Common/useERC20TokenList';
import React, { FC } from 'react'

export const DepositPart: FC<{}> = () => {
    const [currency, setCurrency] = React.useState<string>('');
    const tokens = useERC20TokenList();

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
                                        <TextField id="currency_amount_input" label="Amount of" fullWidth variant='outlined' onChange={(event) => console.log(event.target.value)} />
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