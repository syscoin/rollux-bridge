import { ChaingeProvider } from "components/BridgeL1L2/OtherProviders/Providers/ChaingeProvider";
import { CoinifyProvider } from "components/BridgeL1L2/OtherProviders/Providers/CoinifyProvider";
import { OtherBridgeProvider } from "./types";

export const providers: OtherBridgeProvider[] = [
    {
        label: 'Chainge',
        code: 'chainge',
        description: 'Chainge 3rd party bridge provider',
        url: 'chainge.io',
        logoUrl: '/bridge-providers/chainge-logo.png',
        supportsCrypto: true,
        supportsFiat: false,
        enabled: true,
        component: ChaingeProvider,
        askOpenInNewTab: false,
        supportsDeposits: true,
        supportsWithdrawals: true,
    },
    {
        label: 'Coinify',
        code: 'coinify',
        description: 'Coinify 3rd party bridge provider',
        url: 'coinify.io',
        logoUrl: '/logocoinify.svg',
        supportsCrypto: false,
        supportsFiat: true,
        enabled: true,
        component: CoinifyProvider,
        askOpenInNewTab: false,
        supportsDeposits: true,
        supportsWithdrawals: true,
    }
]
