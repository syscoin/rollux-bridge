import { Box, Card, CardHeader, CardContent, Typography, Container } from "@mui/material";
import { DataGrid, GridRowId, GridRowParams, GridActionsCellItem } from "@mui/x-data-grid";
import React, { FC, useCallback } from "react"
import { Info } from "@mui/icons-material";
import { useTheme, useMediaQuery } from "@mui/material"

type OnGoingTxnsProps = {
    txns: { hash: string, amount: string, symbol: string, step: number }[];
    onTxnInfoRequested: (hash: string) => void;
}

export const OnGoingTxns: FC<OnGoingTxnsProps> = ({ txns, onTxnInfoRequested }) => {

    const handleInfoClick = useCallback((id: GridRowId) => () => {
        onTxnInfoRequested(id.toString());
    }, [onTxnInfoRequested])

    return (
        <Box component={Container} sx={{ mt: 5 }}>
            <Card>
                <CardContent>

                    <Typography variant="h5" sx={{ mb: 3 }}>
                        Ongoing txns
                    </Typography>
                    <div style={{ height: '20vh' }} >
                        <DataGrid columns={[
                            { field: 'hash', headerName: 'Withdraw TX hash', width: 300 },
                            { field: 'amount', headerName: 'Amount', width: 150 },
                            { field: 'symbol', headerName: 'Asset', width: 150 },
                            { field: 'step', headerName: 'Current Step', width: 150 },
                            {
                                field: 'actions', type: 'actions',
                                headerName: 'Actions',
                                getActions: (params: GridRowParams) => [
                                    <GridActionsCellItem key={'action-' + params.id.toString()} icon={<Info />} onClick={handleInfoClick(params.id)} label="View" />,
                                ]
                            },
                        ]} rows={txns}
                            getRowId={(row) => row.hash}
                            disableColumnFilter={true}
                            hideFooterPagination={true}
                            hideFooter={true}
                            autoHeight={false}

                        />

                    </div>
                </CardContent>
            </Card>
        </Box >
    );
}

export default OnGoingTxns;