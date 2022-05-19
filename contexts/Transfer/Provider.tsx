import { createContext, Dispatch, useReducer } from "react";
import { TransferActions } from "./store/actions";
import reducer from "./store/reducer";
import { ITransfer, TransferType } from "./types";

import { syscoin, utils as syscoinUtils } from "syscoinjs-lib";
import satoshibitcoin from "satoshi-bitcoin";
import BN from "bn.js";
import { SYSX_ASSET_GUID } from "./constants";
import { useConnectedWallet } from "../ConnectedWallet/useConnectedWallet";

interface ITransferContext {
  transfer: ITransfer;
  dispatch: Dispatch<TransferActions>;
  startTransfer: (type: TransferType) => void;
}

export const TransferContext = createContext({} as ITransferContext);

type TransferProviderProps = {
  id: string;
  children: React.ReactNode;
};

const initialState: ITransfer = {
  amount: "0",
  id: "",
  type: "sys-to-nevm",
  status: "pending",
  logs: [],
};

const TransferProvider: React.FC<TransferProviderProps> = ({
  id,
  children,
}) => {
  const { utxo } = useConnectedWallet();
  const [transfer, dispatch] = useReducer<typeof reducer>(reducer, {
    ...initialState,
    id,
  });

  const sysToSysx = async (
    amount: string,
    xpub: string,
    sysAddress: string
  ) => {
    const feeRate = new BN(10);
    const txOpts = { rbf: true };
    const assetGuid = SYSX_ASSET_GUID;
    const assetChangeAddress = sysAddress;
    const assetMap = new Map([
      [
        assetGuid,
        {
          changeAddress: assetChangeAddress,
          outputs: [
            {
              value: new BN(satoshibitcoin.toSatoshi(amount)),
              address: sysAddress,
            },
          ],
        },
      ],
    ]);
    const assetOpts = { ethaddress: Buffer.from("") };
    const res = await syscoin.assetAllocationBurn(
      assetOpts,
      txOpts,
      assetMap,
      sysAddress,
      feeRate,
      xpub
    );
    return syscoinUtils.exportPsbtToJson(res.psbt, res.assets);
  };

  const startTransfer = (transferType: TransferType) => {
    if (transferType === "sys-to-nevm") {
      dispatch({
        type: "set-type",
        payload: {
          type: transferType,
        },
      });
      startSysToNevmTransfer();
    }
  };

  const startSysToNevmTransfer = async () => {
    const data = await sysToSysx(transfer.amount, utxo.xpub!, utxo.account!);
  };

  return (
    <TransferContext.Provider value={{ transfer, startTransfer, dispatch }}>
      {children}
    </TransferContext.Provider>
  );
};

export default TransferProvider;
