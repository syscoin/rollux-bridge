import { CurrentDisplayView } from "components/BridgeL1L2/interfaces"
import React from "react"

export interface OtherBridgeProvider extends OtherBridgeProviderBase {
    component: React.ComponentType<OtherBridgeComponentProps> | null,
}

export type OtherBridgeComponentProps = {
    bridgeDetails: OtherBridgeProviderBase,
    mode: CurrentDisplayView,
    payload: any,
}

export interface OtherBridgeProviderBase {
    code: string,
    label: string,
    description: string,
    url: string | null,
    logoUrl: string | null,
    supportsFiat: boolean,
    supportsCrypto: boolean,
    enabled: boolean,
    askOpenInNewTab: boolean,
}

export type OtherBridgeProviderComponentProps<T> = {
    config: OtherBridgeProvider,
    payload: T
}