import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";

const BlocktimeDisclaimer = () => {
  const [open, setOpen] = useState(true);
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        horizontal: "right",
        vertical: "bottom",
      }}
      autoHideDuration={30000}
    >
      <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
        Syscoin&apos;s average block time are 2.5 mins long and transaction time
        may take more than 10 mins. Please keep this in mind when monitoring
        your transactions when using this app.
      </Alert>
    </Snackbar>
  );
};

export default BlocktimeDisclaimer;
