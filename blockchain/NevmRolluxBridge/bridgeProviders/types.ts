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
    SYS = 'Syscoin Mainnet', // Syscoin
    ETH = 'Ethereum Mainnet', // Ethereum
    BSC = 'Binance Smart Chain', // Binance Smart Chain
    MATIC = 'Polygon', // Polygon
}

export enum BridgedCEX {
    BINANCE = 'Binance', // Binance
}

export type FiatOrBridged = FiatMethod | BridgedNetwork | BridgedCEX;

export type OtherBridgeComponentBaseProps = {
    bridgeDetails: OtherBridgeProvider,
    mode: CurrentDisplayView,
    payload: any,
    key: any
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
    supportedTokens: string[],
}

export type OtherBridgeProviderComponentProps<T> = {
    config: OtherBridgeProvider,
    payload: T
}