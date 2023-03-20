import { useCall, useLogs } from "@usedapp/core"
import L2StandardBridgeABI from "blockchain/NevmRolluxBridge/abi/L2StandardBridge"
import { ethers } from 'ethers'
import { useCrossChainMessenger } from "./useCrossChainMessenger";
import { useSelectedNetwork } from "./useSelectedNetwork";
import { DetailedEventRecord } from "@usedapp/core/dist/esm/src/model";
import { MessageStatus } from "@eth-optimism/sdk";

const useWithdrawals = (address: string | undefined, l1Token: string | null = null, l2Token: string | null = null, logsRefresh: number = 5) => {
    const { contractsL2, l2ChainId } = useSelectedNetwork();
    const messenger = useCrossChainMessenger();

    const { value, error } = useLogs(address && {
        contract: new ethers.Contract(contractsL2.L2StandardBridge, new ethers.utils.Interface(L2StandardBridgeABI)),
        event: 'WithdrawalInitiated',
        args: [l1Token, l2Token, address]
    }, { chainId: l2ChainId, refresh: logsRefresh }) ?? {}

    const fetchWithdrawalStatuses = async (withdrawals: DetailedEventRecord<ethers.Contract, "WithdrawalInitiated">[]): Promise<MessageStatus[] | null> => {
        if (withdrawals.length === 0) {
            return null;
        }

        // todo finish


        return null;
    }

    return {
        withdrawals: value,
        fetchError: error
    };
}

export default useWithdrawals;