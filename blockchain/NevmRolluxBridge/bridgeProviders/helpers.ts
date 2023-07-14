import { BridgedCEX, BridgedNetwork, FiatMethod } from "./types";


export const getKeyValue = (keyValue: string) => {
    // try to find keyValue in BridgedNetwork and FiatMethod and return one of them
    let value = '';
    value = BridgedNetwork[keyValue as keyof typeof BridgedNetwork];
    if (value) return value;
    value = FiatMethod[keyValue as keyof typeof FiatMethod];
    if (value) return value;

    value = BridgedCEX[keyValue as keyof typeof BridgedCEX];
    if (value) return value;

    return keyValue;
}

export const isCryptoProvider = (keyValue: string): boolean => {
    let value = '';
    value = BridgedNetwork[keyValue as keyof typeof BridgedNetwork];

    if (value) {
        return true;
    }
    return false;
}

export const isFiatProvider = (keyValue: string): boolean => {
    let value = '';
    value = FiatMethod[keyValue as keyof typeof FiatMethod];

    if (value) {
        return true;
    }
    return false;
}

export const isCEXProvider = (keyValue: string): boolean => {
    let value = '';
    value = BridgedCEX[keyValue as keyof typeof BridgedCEX];

    if (value) {
        return true;
    }
    return false;
}