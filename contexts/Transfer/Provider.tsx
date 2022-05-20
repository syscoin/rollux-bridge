import { createContext, useMemo, useReducer } from "react";
import reducer from "./store/reducer";
import { ITransfer, TransferType } from "./types";

import { syscoin, utils as syscoinUtils } from "syscoinjs-lib";
import satoshibitcoin from "satoshi-bitcoin";
import BN from "bn.js";
import { BlockbookAPIURL, SYSX_ASSET_GUID } from "./constants";
import { useConnectedWallet } from "../ConnectedWallet/useConnectedWallet";

interface ITransferContext {
  transfer: ITransfer;
  startTransfer: (type: TransferType) => void;
  updateAmount: (amount: string) => void;
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
  const syscoinInstance = useMemo(
    () =>
      new syscoin(null, BlockbookAPIURL, syscoinUtils.syscoinNetworks.mainnet),
    []
  );
  const { utxo, sendUtxoTransaction } = useConnectedWallet();
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
              address: assetChangeAddress,
            },
          ],
        },
      ],
    ]);
    const res = await syscoinInstance.syscoinBurnToAssetAllocation(
      txOpts,
      assetMap,
      assetChangeAddress,
      feeRate,
      xpub
    );
    return syscoinUtils.exportPsbtToJson(res.psbt, res.assets);
  };

  const startTransfer = (transferType: TransferType) => {
    if (transferType === "sys-to-nevm") {
      dispatch({
        type: "set-type",
        payload: transferType,
      });
      startSysToNevmTransfer();
    }
  };

  const startSysToNevmTransfer = () => {
    const run = async () => {
      const data = await sysToSysx(transfer.amount, utxo.xpub!, utxo.account!);
      console.log({ serialized: data });
      const tx = await sendUtxoTransaction(data);
      console.log({ tx });
    };
    run()
      .then(() => {
        console.log("success");
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const updateAmount = (amount: string) => {
    dispatch({
      type: "set-amount",
      payload: amount,
    });
  };

  return (
    <TransferContext.Provider value={{ transfer, startTransfer, updateAmount }}>
      {children}
    </TransferContext.Provider>
  );
};

export default TransferProvider;
