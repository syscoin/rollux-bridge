import { CurrentDisplayView } from "components/BridgeL1L2/interfaces"
import React from "react"

export enum FiatMethod {
    USD = 'USD', // US Dollar
    EUR = 'EUR', // Euro
    CNY = 'CNY', // Chinese Yuan
    JPY = 'JPY', // Japanese Yen
    PLN = 'PLN' // Polish Zloty
}

export enum BridgedNetwork {
    SYS = 'SYS', // Syscoin
    ETH = 'ETH', // Ethereum
    BSC = 'BSC', // Binance Smart Chain
    MATIC = 'MATIC', // Polygon
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
    supportedInputs: FiatOrBridged[],
    supportedOutputs: FiatOrBridged[],
}

export type OtherBridgeProviderComponentProps<T> = {
    config: OtherBridgeProvider,
    payload: T
}