import { Box, Card, CardContent, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { FC } from 'react'

export const DepositPart: FC<{}> = () => {
    const [currency, setCurrency] = React.useState<string>('');
    return (
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
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>

                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Box >
    )
}