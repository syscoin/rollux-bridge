import { syscoin, utils as syscoinUtils } from "syscoinjs-lib";
import satoshibitcoin from "satoshi-bitcoin";
import { SYSX_ASSET_GUID } from "../constants";
import BN from "bn.js";

export const burnSysToSysx = async (
  syscoinInstance: syscoin,
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
  if (!res) {
    throw new Error("Could not create transaction, not enough funds?");
  }
  return syscoinUtils.exportPsbtToJson(res.psbt, res.assets);
};

export default burnSysToSysx;
