import { Alert, Box, Button, Container, Typography, Link } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import DrawerPage from "components/DrawerPage";
import WalletList from "components/WalletList";
import { useConnectedWallet } from "contexts/ConnectedWallet/useConnectedWallet";
import { ITransfer } from "contexts/Transfer/types";
import { NextPage } from "next";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

const DateField: React.FC<{ value: number }> = ({ value }) => {
  if (!value) {
    return (
      <Typography variant="body2" color="GrayText">
        EMPTY
      </Typography>
    );
  }
  return (
    <Typography variant="body1">{new Date(value).toLocaleString()}</Typography>
  );
};

const TransfersPage: NextPage = () => {
  const [items, setItems] = useState<ITransfer[]>([]);
  const { utxo, nevm } = useConnectedWallet();
  const isFullyConnected = Boolean(utxo.account && nevm.account);
  const { data, isFetched, isLoading, error } = useQuery(
    "transfers",
    () => {
      const searchParams = new URLSearchParams();
      if (utxo.xpub) {
        searchParams.set("utxo", utxo.xpub);
      }
      if (nevm.account) {
        searchParams.set("nevm", nevm.account);
      }
      return axios(`/api/transfer?${searchParams.toString()}`);
    },
    { enabled: isFullyConnected }
  );

  useEffect(() => {
    if (!localStorage) {
      return;
    }
    setItems(
      Object.entries(localStorage)
        .filter(([key]) => key.startsWith("transfer-"))
        .map(([key, value]) => JSON.parse(value))
    );
  }, []);

  return (
    <DrawerPage>
      <Container sx={{ py: 10 }}>
        <Typography variant="h5" marginBottom={"1rem"}>
          Transfers
        </Typography>
        <Box display="flex" mb={2}>
          <NextLink href={`/bridge/${Date.now()}`}>
            <Button sx={{ ml: "auto" }}>New Transfer</Button>
          </NextLink>
        </Box>
        <DataGrid
          loading={isLoading}
          columns={[
            {
              field: "id",
              headerName: "Id",
              width: 130,
              renderCell: ({ value }) => (
                <NextLink href={`/bridge/${value}`}>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ cursor: "pointer" }}
                  >
                    {value}
                  </Typography>
                </NextLink>
              ),
            },
            {
              field: "type",
              headerName: "Type",
            },
            {
              field: "amount",
              headerName: "Amount",
              renderCell: ({ value }) => `${value} SYS`,
            },
            {
              field: "utxoAddress",
              headerName: "ZPUB",
              width: 320,
            },
            {
              field: "nevmAddress",
              headerName: "NEVM",
              width: 300,
            },
            {
              field: "status",
              headerName: "Status",
              renderCell: ({ value }) => {
                let color = "inherit";
                if (value === "completed") {
                  color = "green";
                }
                if (value === "error") {
                  color = "error";
                }
                return (
                  <Typography variant="body1" color={color}>
                    {value}
                  </Typography>
                );
              },
            },
            {
              field: "createdAt",
              headerName: "Created At",
              width: 200,
              renderCell: ({ value }) => <DateField value={value} />,
            },
            {
              field: "updatedAt",
              headerName: "Updated At",
              width: 200,
              renderCell: ({ value }) => <DateField value={value} />,
            },
          ]}
          rows={isFetched ? data?.data ?? items : []}
          sx={{ background: "white", mb: 2 }}
          autoHeight
          error={error}
        />
        {!isFullyConnected && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body1">Connect both wallets</Typography>
          </Alert>
        )}
        <WalletList />
      </Container>
    </DrawerPage>
  );
};

export default TransfersPage;
