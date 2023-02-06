import { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core";

export const useMainTokenBalance = () => {
    const [balance, setBalance] = useState<number>(0);
    const { account, library } = useWeb3React();

    useEffect(() => {

    });
}