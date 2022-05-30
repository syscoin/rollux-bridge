import { Box, Button, Container, Link, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DrawerPage from "components/DrawerPage";
import WalletList from "components/WalletList";
import { useConnectedWallet } from "contexts/ConnectedWallet/useConnectedWallet";
import { ITransfer } from "contexts/Transfer/types";
import { NextPage } from "next";
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

  const { data, isFetched } = useQuery(
    "transfers",
    () => {
      const searchParams = new URLSearchParams();
      searchParams.set("utxo", utxo.account!);
      searchParams.set("nevm", nevm.account!);
      return fetch(`/api/transfer?${searchParams.toString()}`).then((resp) =>
        resp.json()
      );
    },
    { enabled: Boolean(utxo?.account || nevm?.account) }
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
          <Button
            component={Link}
            sx={{ ml: "auto" }}
            href={`/bridge/${Date.now()}`}
          >
            New Transfer
          </Button>
        </Box>

        <DataGrid
          columns={[
            {
              field: "id",
              headerName: "Id",
              width: 130,
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
              headerName: "UTXO",
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
            {
              field: "actions",
              headerName: "Actions",
              renderCell: ({ id }) => {
                return <Link href={`/bridge/${id}`}>View</Link>;
              },
            },
          ]}
          rows={isFetched ? data ?? items : []}
          sx={{ background: "white", mb: 2 }}
          autoHeight
        />
        <WalletList />
      </Container>
    </DrawerPage>
  );
};

export default TransfersPage;
