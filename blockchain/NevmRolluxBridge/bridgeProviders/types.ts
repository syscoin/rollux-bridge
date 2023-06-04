import { CurrentDisplayView } from "components/BridgeL1L2/interfaces"
import React from "react"

export enum FiatMethod {
    USD,
    EUR,
    CNY,
    JPY,
    PLN
}

export enum BridgedNetwork {
    ETH,
    BSC,
    MATIC,
    ARB,
    ETC
}

export type FiatOrBridged = FiatMethod | BridgedNetwork;

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
    supportedInputs: FiatOrBridged[]
}

export type OtherBridgeProviderComponentProps<T> = {
    config: OtherBridgeProvider,
    payload: T
}