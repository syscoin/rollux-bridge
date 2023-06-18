import { useContext } from "react";
import { TransferContext } from "./Provider";

export const useTransfer = () => useContext(TransferContext);
