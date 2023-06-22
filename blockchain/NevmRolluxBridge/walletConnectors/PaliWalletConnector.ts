import { Connector, ConnectorUpdateData, ConnectorEvent } from '@usedapp/core'
import { providers } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'

const GET_PALI_LINK = 'https://paliwallet.com/'

// interface MetaMaskEthereumProvider {
//     isMetaMask?: boolean;
//     once(eventName: string | symbol, listener: (...args: any[]) => void): this;
//     on(eventName: string | symbol, listener: (...args: any[]) => void): this;
//     off(eventName: string | symbol, listener: (...args: any[]) => void): this;
//     addListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
//     removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
//     removeAllListeners(event?: string | symbol): this;
// }


// function detectEthereumProvider<T = MetaMaskEthereumProvider>({
//     mustBeMetaMask = false,
//     silent = false,
//     timeout = 3000,
// } = {}): Promise<T | null> {

//     _validateInputs();

//     let handled = false;

//     return new Promise((resolve) => {
//         if ((window as Window).ethereum && (window as any).pali) {

//             handleEthereum();

//         } else {

//             window.addEventListener(
//                 'ethereum#initialized',
//                 handleEthereum,
//                 { once: true },
//             );

//             setTimeout(() => {
//                 handleEthereum();
//             }, timeout);
//         }

//         function handleEthereum() {

//             if (handled) {
//                 return;
//             }
//             handled = true;

//             window.removeEventListener('ethereum#initialized', handleEthereum);

//             const { ethereum } = window as Window;
//             const { pali } = window as any;
//             console.log(ethereum);

//             if (ethereum && (!mustBeMetaMask || ethereum.isMetaMask) && pali) {
//                 resolve(ethereum as unknown as T);
//             } else {

//                 const message = mustBeMetaMask && ethereum
//                     ? 'Non-MetaMask window.ethereum detected.'
//                     : 'Unable to detect window.ethereum.';

//                 !silent && console.error('@metamask/detect-provider:', message);
//                 resolve(null);
//             }
//         }
//     });

//     function _validateInputs() {
//         if (typeof mustBeMetaMask !== 'boolean') {
//             throw new Error(`@metamask/detect-provider: Expected option 'mustBeMetaMask' to be a boolean.`);
//         }
//         if (typeof silent !== 'boolean') {
//             throw new Error(`@metamask/detect-provider: Expected option 'silent' to be a boolean.`);
//         }
//         if (typeof timeout !== 'number') {
//             throw new Error(`@metamask/detect-provider: Expected option 'timeout' to be a number.`);
//         }
//     }
// }

export async function getMetamaskProvider() {
    if (!(window as any).pali) {
        window.open(GET_PALI_LINK)
        return undefined
    }

    if ((window as any).pali && !(window as any).ethereum) {
        console.log('Pali not activated for EVM');

        return undefined;
    }

    const injectedProviders: any[] = (window as any)?.ethereum.providers || []
    const injectedProvider: any =
        injectedProviders.find((provider) => {
            console.log(provider);
            return provider.isMetaMask ?? false
        }) ?? await detectEthereumProvider({ mustBeMetaMask: true })

    if (!injectedProvider) {
        console.log(`Pali wallet is not installed - you can get it under ${GET_PALI_LINK}`)
        return undefined
    }

    const provider = new providers.Web3Provider(injectedProvider, 'any')
    return provider
}

export class PaliWalletConnector implements Connector {
    public provider?: providers.Web3Provider
    public readonly name = 'PaliWalletV2'

    readonly update = new ConnectorEvent<ConnectorUpdateData>()

    private async init() {
        if (this.provider) return
        const metamask = await getMetamaskProvider()
        if (!metamask) {
            return
        }
        this.provider = metamask
    }

    async connectEagerly(): Promise<void> {
        await this.init()

        if (!this.provider) {
            return
        }

        try {
            const chainId: string = await this.provider!.send('eth_chainId', [])
            console.log(chainId);
            const accounts: string[] = await this.provider!.send('eth_accounts', [])
            this.update.emit({ chainId: parseInt(chainId), accounts })
        } catch (e) {
            console.debug(e)
        }
    }

    async activate(): Promise<void> {
        await this.init()

        if (!this.provider) {
            throw new Error('Could not activate connector')
        }

        try {
            const chainId: string = await this.provider!.send('eth_chainId', [])
            const accounts: string[] = await this.provider!.send('eth_requestAccounts', [])
            this.update.emit({ chainId: parseInt(chainId), accounts })
        } catch (e: any) {
            console.log(e)

            throw new Error('Could not activate connector: ' + (e.message ?? ''))
        }
    }

    async deactivate(): Promise<void> {
        this.provider = undefined
    }
}
