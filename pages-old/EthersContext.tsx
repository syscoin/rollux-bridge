import { useConnectedWallet } from "@contexts/ConnectedWallet/useConnectedWallet";
import { useMetamask } from "@contexts/Metamask/Provider";
import { ProviderLike, SignerLike } from "@eth-optimism/sdk";
import { ethers } from "ethers";
import { Context, createContext, FC, ReactNode, useEffect, useState } from "react";

export interface EthersWrapperContextI {
    signer: SignerLike | string,
    provider: ProviderLike | string,
}


const EthersWrapperContext: Context<EthersWrapperContextI> = createContext({} as EthersWrapperContextI);

const EthersWrapperProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const [signer, setSigner] = useState<SignerLike>('');
    const [provider, setProvider] = useState<ProviderLike>('');
    const [providerEvents, setProviderEvents] = useState<any[]>([]);

    const { web3 } = useConnectedWallet();

    useEffect(() => {
        if (web3) {
            const _provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider, "any");

            const _signer = _provider.getSigner();

            setSigner(_signer);
            setProvider(_provider);
        }
    }, [web3]);

    useEffect(() => {
        if (provider !== '' && signer !== '') {
            console.log(provider, signer);
        }
    }, [provider, signer])

    return (
        <EthersWrapperContext.Provider
            value={{
                signer: signer,
                provider: provider
            }}
        >
            {children}
        </EthersWrapperContext.Provider>
    )
}

export default EthersWrapperProvider;