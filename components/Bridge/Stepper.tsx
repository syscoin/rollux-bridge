import { Step, StepLabel, Stepper } from "@mui/material";
import { TransferStatus } from "contexts/Transfer/types";
import { useTransfer } from "contexts/Transfer/useTransfer";

interface Step {
  id: TransferStatus;
  label: string;
}

const BridgeTransferStepper: React.FC = () => {
  const {
    transfer: { type, status },
  } = useTransfer();
  const steps: Step[] =
    type === "sys-to-nevm"
      ? [
          {
            id: "initialize",
            label: "Initialize",
          },
          {
            id: "burn-sys",
            label: "Burn SYS",
          },
          {
            id: "burn-sysx",
            label: "Burn SYSX",
          },
          {
            id: "generate-proofs",
            label: "Generate Proofs",
          },
          {
            id: "submit-proofs",
            label: "Submit Proofs",
          },
          {
            id: "completed",
            label: "Completed",
          },
        ]
      : [];

  const activeStep = steps.findIndex((step) => step.id === status);

  return (
    <Stepper activeStep={activeStep || 0} alternativeLabel sx={{ mb: 2 }}>
      {steps.map((step) => (
        <Step key={step.id}>
          <StepLabel>{step.label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default BridgeTransferStepper;
