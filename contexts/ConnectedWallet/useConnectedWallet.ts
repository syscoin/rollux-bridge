import { useContext } from "react";
import { ConnectedWalletContext } from "./Provider";

export const useConnectedWallet = () => useContext(ConnectedWalletContext);
