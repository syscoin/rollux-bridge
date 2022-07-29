import { Alert, Step, StepLabel, Stepper } from "@mui/material";
import { TransferStatus } from "contexts/Transfer/types";
import { useTransfer } from "contexts/Transfer/useTransfer";

interface Step {
  id: TransferStatus;
  label: string;
}

const sysToNevmSteps: Step[] = [
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
    id: "finalizing",
    label: "Finalizing",
  },
];

const nevmToSysSteps: Step[] = [
  {
    id: "freeze-burn-sys",
    label: "Freeze and Burn (NEVM)",
  },
  {
    id: "confirm-freeze-burn-sys",
    label: "Confirm Freeze and Burn (NEVM)",
  },
  {
    id: "mint-sysx",
    label: "Mint SYSX",
  },
  {
    id: "burn-sysx",
    label: "Burn SYSX to SYS",
  },
  {
    id: "finalizing",
    label: "Finalizing",
  },
];

const BridgeTransferStepper: React.FC = () => {
  const {
    transfer: { type, status },
  } = useTransfer();
  const initializeStep = {
    id: "initialize",
    label: "Initialize",
  };
  const completeStep = {
    id: "completed",
    label: "Completed",
  };
  let conditionalSteps: Step[] = [];
  if (type === "sys-to-nevm") {
    conditionalSteps = sysToNevmSteps;
  } else if (type === "nevm-to-sys") {
    conditionalSteps = nevmToSysSteps;
  } else {
    return <Alert severity="error">Invalid Transfer type</Alert>;
  }
  const steps = [initializeStep, ...conditionalSteps, completeStep];
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
