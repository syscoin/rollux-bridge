import {
  Button,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { RocketLaunch } from "@mui/icons-material";
import { useTransfer } from "contexts/Transfer/useTransfer";
import { FieldValues, useForm } from "react-hook-form";

const BridgeTransferForm: React.FC = () => {
  const { startTransfer } = useTransfer();
  const {
    register,
    formState: { errors, isValid, isDirty },
    handleSubmit,
  } = useForm({ mode: "all" });

  const onSubmit = (data: FieldValues) => {
    startTransfer(data.amount);
  };

  return (
    <Card component="form" onSubmit={handleSubmit(onSubmit)}>
      <CardContent sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          label="Amount"
          placeholder="0.01"
          margin="dense"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]+.[0-9]*" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">SYS</InputAdornment>,
          }}
          {...register("amount", {
            valueAsNumber: true,
            min: {
              value: 0.001,
              message: "Amount must be atleast 0.1",
            },
            required: {
              message: "Amount is required",
              value: true,
            },
            validate: (value) =>
              isNaN(value) ? "Must be a number" : undefined,
          })}
          error={!!errors.amount}
          helperText={errors.amount && errors.amount.message}
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
