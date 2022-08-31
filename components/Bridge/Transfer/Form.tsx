import {
  Button,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { RocketLaunch } from "@mui/icons-material";

import { FieldValues, useForm } from "react-hook-form";
import { useTransfer } from "../../../contexts/Transfer/useTransfer";
import { useEffect } from "react";

const BridgeTransferForm: React.FC = () => {
  const { startTransfer, maxAmount } = useTransfer();
  const {
    register,
    formState: { errors, isValid, isDirty },
    handleSubmit,
  } = useForm({ mode: "all" });

  const onSubmit = (data: FieldValues) => {
    startTransfer(data.amount);
  };

  const maxAmountFixed = parseFloat(`${maxAmount ?? "0"}`).toFixed(4);

  return (
    <Card component="form" onSubmit={handleSubmit(onSubmit)}>
      <CardContent sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="body2" color="secondary">
          Balance: {maxAmount === undefined ? "--" : maxAmountFixed}
        </Typography>
        <TextField
          label="Amount"
          placeholder="0.1"
          margin="dense"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]+(\.?[0-9]+)?" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">SYS</InputAdornment>,
          }}
          {...register("amount", {
            valueAsNumber: true,
            max: {
              value: maxAmountFixed,
              message: `You can transfer up to ${maxAmountFixed} SYS`,
            },
            min: {
              value: 0.1,
              message: "Amount must be atleast 0.1",
            },
            required: {
              message: "Amount is required",
              value: true,
            },
            validate: (value) =>
              isNaN(value) ? "Must be a number" : undefined,
          })}
          disabled={maxAmount === undefined}
          error={!!errors.amount}
          helperText={<>{errors.amount && errors.amount.message}</>}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={!isDirty || !isValid}
        >
          Start Transfer <RocketLaunch />
        </Button>
      </CardContent>
    </Card>
  );
};

export default BridgeTransferForm;
