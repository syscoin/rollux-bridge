import { useContext } from "react";
import { PaliWalletContext } from "./Provider";


export const usePaliWallet = () => useContext(PaliWalletContext);