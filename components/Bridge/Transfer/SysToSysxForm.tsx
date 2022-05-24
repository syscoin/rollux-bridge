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


const BridgeSysToSysxForm: React.FC = () => {
  const { updateAmount, transfer, startTransfer } = useTransfer();
  return (
    <Card component="form">
      <CardContent sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          label="Amount"
          placeholder="0.01"
          margin="dense"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">SYS</InputAdornment>,
          }}
          value={transfer.amount}
          onChange={(e) => updateAmount(e.target.value)}
        />
        <Typography variant="caption" sx={{ mt: 2 }}>
          # This will convert SYS into SYSX (SPT version of SYS)
        </Typography>
        <Button
          variant="contained"
          onClick={() => startTransfer("sys-to-nevm")}
        >
          Burn
          <LocalFireDepartmentIcon />
        </Button>
      </CardContent>
    </Card>
  );
};

export default BridgeSysToSysxForm;
