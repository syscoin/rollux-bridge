import { OtherBridgeProvider } from "./types";

export const providers: OtherBridgeProvider[] = [
    {
        label: 'Chainge',
        code: 'chainge',
        description: 'Chainge 3rd party bridge provider',
        url: 'chainge.io',
        logoUrl: '/logochainge.svg',
        supportsCrypto: true,
        supportsFiat: false,
        enabled: true,
        component: ReactComponentHere,
        askOpenInNewTab: false,
    }
]
