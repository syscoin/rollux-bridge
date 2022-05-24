import { Box, Button, Container, Link, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DrawerPage from "components/DrawerPage";
import { ITransfer } from "contexts/Transfer/types";
import { NextPage } from "next";
import { useEffect, useState } from "react";

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
              width: 150,
            },
            {
              field: "type",
              headerName: "Type",
            },
            {
              field: "amount",
              headerName: "Amount",
            },
            {
              field: "status",
              headerName: "Status",
              renderCell: ({ value }) => {
                return (
                  <Typography
                    variant="body1"
                    color={value === "completed" ? "green" : "inherit"}
                  >
                    {value}
                  </Typography>
                );
              },
            },
            {
              field: "createdAt",
              headerName: "Created At",
              flex: 1,
              renderCell: ({ value }) => <DateField value={value} />,
            },
            {
              field: "updatedAt",
              headerName: "Updated At",
              flex: 1,
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
          rows={items ?? []}
          sx={{ background: "white" }}
          autoHeight
        />
      </Container>
    </DrawerPage>
  );
};

export default TransfersPage;
