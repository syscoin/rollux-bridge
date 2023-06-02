import { CurrentDisplayView } from "components/BridgeL1L2/interfaces"
import React from "react"

export type OtherBridgeComponentBaseProps = {
    bridgeDetails: OtherBridgeProvider,
    mode: CurrentDisplayView,
    payload: any,
}

export interface OtherBridgeProvider {
    code: string,
    label: string,
    description: string,
    url: string | null,
    logoUrl: string | null,
    supportsFiat: boolean,
    supportsCrypto: boolean,
    enabled: boolean,
    component: React.ComponentType<OtherBridgeComponentBaseProps> | null,
    askOpenInNewTab: boolean,
    supportsDeposits: boolean,
    supportsWithdrawals: boolean,
}

export type OtherBridgeProviderComponentProps<T> = {
    config: OtherBridgeProvider,
    payload: T
}