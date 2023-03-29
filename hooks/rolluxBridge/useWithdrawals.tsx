import { useCall, useLogs } from "@usedapp/core"
import L2StandardBridgeABI from "blockchain/NevmRolluxBridge/abi/L2StandardBridge"
import { ethers } from 'ethers'
import { useCrossChainMessenger } from "./useCrossChainMessenger";
import { useSelectedNetwork } from "./useSelectedNetwork";
import { DetailedEventRecord } from "@usedapp/core/dist/esm/src/model";
import { MessageStatus } from "@eth-optimism/sdk";
import { useCallback, useMemo } from "react";

const useWithdrawals = (address: string | undefined, l1Token: string | null = null, l2Token: string | null = null, logsRefresh: number = 5) => {
    const { contractsL2, l2ChainId } = useSelectedNetwork();
    const messenger = useCrossChainMessenger();

    const { value: withdrawalsLogs, error: withdrawalsError } = useLogs(address && {
        contract: new ethers.Contract(contractsL2.L2StandardBridge, new ethers.utils.Interface(L2StandardBridgeABI)),
        event: 'WithdrawalInitiated',
        args: [l1Token, l2Token, address]
    }, { chainId: l2ChainId, refresh: logsRefresh }) ?? {}


    const listAll = useMemo(async () => {
        if (!messenger) {
            return [];
        }
        const withdrawals = withdrawalsLogs ?? [];

        const result = withdrawals.map(async (withdrawal, index) => {
            let status = null;

            // try {
            //     status = await messenger.getMessageReceipt(withdrawal.transactionHash);
            // } catch (e) {
            //     console.log(e);
            // }
            return {
                withdrawal: withdrawal,
                status: status
            };
        });

        return Promise.all(result);
    }, [withdrawalsLogs, messenger]);

    return {
        withdrawalsLogs,
        withdrawalsError,
        listAll
    };
}

export default useWithdrawals;