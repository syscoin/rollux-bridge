import { Connector, ConnectorUpdateData, ConnectorEvent } from '@usedapp/core'
import { providers } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'

const GET_PALI_LINK = 'https://paliwallet.com/'

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
        }) ?? (await detectEthereumProvider())

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

            if (e.error.message.includes('method has not been authorized by the user')) {
                console.error('User need to update their Pali wallet settings to enable window.ethereum');
            }

            throw new Error('Could not activate connector: ' + (e.message ?? ''))
        }
    }

    async deactivate(): Promise<void> {
        this.provider = undefined
    }
}


export default PaliWalletConnector;