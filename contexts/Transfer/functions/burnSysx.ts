import { syscoin, utils as syscoinUtils } from "syscoinjs-lib";
import satoshibitcoin from "satoshi-bitcoin";
import { SYSX_ASSET_GUID } from "../constants";
import BN from "bn.js";

export const burnSysx = async (
  syscoinInstance: syscoin,
  amount: string,
  assetGuid = SYSX_ASSET_GUID,
  sysChangeAddress: string,
  xpubAddress: string,
  ethAddressStripped: string
) => {
  const feeRate = new BN(10);
  const txOpts = { rbf: true };
  const assetOpts = { ethaddress: Buffer.from(ethAddressStripped, "hex") };
  const assetChangeAddress = sysChangeAddress;
  const assetMap = new Map([
    [
      assetGuid,
      {
        changeAddress: assetChangeAddress,
        outputs: [
          {
            value: new BN(satoshibitcoin.toSatoshi(amount)),
            address: sysChangeAddress,
          },
        ],
      },
    ],
  ]);

  const res = await syscoinInstance.assetAllocationBurn(
    assetOpts,
    txOpts,
    assetMap,
    sysChangeAddress,
    feeRate,
    xpubAddress
  );
  if (!res) {
    throw new Error("Could not create transaction, not enough funds?", {
      cause: res,
    });
  }
  return syscoinUtils.exportPsbtToJson(res.psbt, res.assets);
};

export default burnSysx;
