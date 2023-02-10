import { CrossChainMessenger, NumberLike, AddressLike, MessageReceipt } from "@eth-optimism/sdk";
import { Overrides, Signer } from "ethers";

export const depositMainToken = async (messenger: CrossChainMessenger, amount: NumberLike, opts?: {
    recipient?: AddressLike;
    signer?: Signer;
    l2GasLimit?: NumberLike;
    overrides?: Overrides;
}): Promise<MessageReceipt> => {
    const depositTx = await messenger.depositETH(amount, opts);

    const receipt = await messenger.waitForMessageReceipt(depositTx);

    return receipt;
}