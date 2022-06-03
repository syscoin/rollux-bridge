import {
  Button,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useTransfer } from "contexts/Transfer/useTransfer";
import { FieldValues, useForm } from "react-hook-form";

const BridgeSysToSysxForm: React.FC = () => {
  const { startTransfer } = useTransfer();
  const {
    register,
    formState: { errors, isValid, isDirty },
    handleSubmit,
  } = useForm({ mode: "all" });

  const onSubmit = (data: FieldValues) => {
    startTransfer(data.amount, "sys-to-nevm");
  };

  return (
    <Card component="form" onSubmit={handleSubmit(onSubmit)}>
      <CardContent sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          label="Amount"
          placeholder="0.01"
          margin="dense"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">SYS</InputAdornment>,
          }}
          {...register("amount", {
            valueAsNumber: true,
            min: {
              value: 1,
              message: "Amount must be greater than 0",
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
        <Typography variant="caption" sx={{ mt: 2 }}>
          # This will convert SYS into SYSX (SPT version of SYS)
        </Typography>
        <Button
          variant="contained"
          type="submit"
          disabled={!isDirty || !isValid}
        >
          Burn
          <LocalFireDepartmentIcon />
        </Button>
      </CardContent>
    </Card>
  );
};

export default BridgeSysToSysxForm;
