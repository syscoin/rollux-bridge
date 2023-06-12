import { BridgedNetwork, FiatMethod } from "./types";


export const getKeyValue = (keyValue: string) => {
    // try to find keyValue in BridgedNetwork and FiatMethod and return one of them
    let value = '';
    value = BridgedNetwork[keyValue as keyof typeof BridgedNetwork];
    if (value) return value;
    value = FiatMethod[keyValue as keyof typeof FiatMethod];
    if (value) return value;
    return keyValue;
}
