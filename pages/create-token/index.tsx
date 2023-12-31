import { RolluxPageWrapper } from "components/Common/RolluxPageWrapper";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Flex, Heading, Highlight, Input, Link, Spinner, StackDivider, Text, useToast, VStack } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useSelectedNetwork } from "hooks/rolluxBridge/useSelectedNetwork";
import { ERC20Interface, useContractFunction, useEthers, shortenIfAddress } from "@usedapp/core";
import { SelectedNetworkType } from "blockchain/NevmRolluxBridge/config/networks";
import OPMintableFactoryABI from '@eth-optimism/contracts-bedrock/artifacts/contracts/universal/OptimismMintableERC20Factory.sol/OptimismMintableERC20Factory.json'
import { TransactionState } from "@usedapp/core";
import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { LogDescription } from "ethers/lib/utils";
import ERC721Abi from "blockchain/NevmRolluxBridge/abi/ERC721"
import OPMintableERC721Factory from "blockchain/NevmRolluxBridge/abi/OPMintableERC721Factory"
import { SwitchNetworkButton } from "components/Common/SwitchNetworkButton";
import { useRouter } from "next/router";


// todo refactor this. This part doesnt affect anything because this address is constant but better to have good code. 
const OPMintableFactory = new ethers.Contract('0x4200000000000000000000000000000000000012', new ethers.utils.Interface(OPMintableFactoryABI.abi));

export enum TokenStandard {
    ERC20,
    ERC721
}

export const CreateTokenIndex: NextPage<{}> = () => {

    const [l1Address, setL1Address] = useState<string>('');
    const [errorText, setErrorText] = useState<string>('');
    const [tokenName, setTokenName] = useState<string>('');
    const [tokenDecimals, setTokenDecimals] = useState<number>();
    const [tokenSymbol, setTokenSymbol] = useState<string>('');
    const { switchNetwork } = useEthers();
    const [tokenStandard, setTokenStandard] = useState<TokenStandard | undefined>(undefined);
    const [isTokenDeployed, setIsTokenDeployed] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (router.query.contract && ethers.utils.isAddress(router.query.contract as string)) {
            setL1Address(router.query.contract as string);
        }
    }, [router.query.contract]);


    const { rpcL1, selectedNetwork, l2ChainId, getExplorerLink, contractsL1, contractsL2 } = useSelectedNetwork();

    const { send: runDeploy, state: deployState } = useContractFunction(
        OPMintableFactory,
        'createOptimismMintableERC20'
    );

    const { send: runERC721Deploy, state: deployERC721State } = useContractFunction(
        (contractsL2.OptimismMintableERC721Factory) ? new ethers.Contract(
            contractsL2.OptimismMintableERC721Factory,
            new ethers.utils.Interface(OPMintableERC721Factory)
        ) : undefined,
        'createOptimismMintableERC721'
    )



    const deployToken = async () => {
        if (!l1Address || !tokenName || !tokenSymbol) return;

        runDeploy(
            l1Address,
            tokenName,
            tokenSymbol
        )
    }



    const deployERC721Token = async () => {
        if (!l1Address || !tokenName || !tokenSymbol) return;

        runERC721Deploy(
            l1Address,
            tokenName,
            tokenSymbol
        )

    }

    const handleL1TokenInput = async (address: string) => {
        setL1Address(address);

        if (!ethers.utils.isAddress(address)) {
            setErrorText("Please enter valid address");
            setTokenDecimals(undefined);
            setTokenName('');
            setTokenSymbol('');
            return;
        }
        const staticProvider = new ethers.providers.StaticJsonRpcProvider(
            rpcL1
        )
        const erc20Contract = new ethers.Contract(address, ERC20Interface, staticProvider);
        const erc721Contract = new ethers.Contract(address, new ethers.utils.Interface(ERC721Abi), staticProvider);

        try {

            try {
                const _decimals: number = await erc20Contract.decimals();
                const _name: string = await erc20Contract.name();
                const _symbol: string = await erc20Contract.symbol();


                setTokenDecimals(_decimals);
                setTokenName(_name);
                setTokenSymbol(_symbol);
                setIsTokenDeployed(false);

                setTokenStandard(TokenStandard.ERC20);
            } catch (e) {

                try {
                    const _symbol = await erc721Contract.symbol();
                    const _name = await erc721Contract.name();
                    await erc721Contract.ownerOf(1);

                    setTokenStandard(TokenStandard.ERC721);
                    setTokenName(_name);
                    setTokenSymbol(_symbol);

                    setIsTokenDeployed(false);

                } catch (e) {
                    console.log("Not an erc721");
                    console.log(e);
                }

            } finally {
                console.log("Finally");
            }

            if (errorText) setErrorText('');
        } catch (e) {


            setErrorText("Please check your token contract or address. Make sure its compatible with ERC20/ERC721 standard.");
            setTokenDecimals(undefined);
            setTokenName('');
            setTokenSymbol('');
        }
    }

    useEffect(() => {
        if (errorText.length > 0) {
            setTimeout(() => {
                setErrorText('');
            }, 5000);
        }
    }, [errorText])

    useEffect(() => {
        if (deployERC721State.status === 'Success') {
            setIsTokenDeployed(true);
        }

        if (deployState.status === 'Success') {
            setIsTokenDeployed(true);
        }
    }, [deployERC721State, deployState])


    const extractDeployedTokenAddress = (receipt: TransactionReceipt): string | null => {
        if (!receipt || !receipt.logs[1]) {
            return null;
        }

        const info: LogDescription = OPMintableFactory.interface.parseLog(receipt.logs[1])

        return info.args?.localToken;
    }

    const extractDeployedERC721TokenAddress = (receipt: TransactionReceipt): string | null => {
        if (!receipt || !receipt.logs[0]) {
            return null;
        }

        const info: LogDescription = (new ethers.utils.Interface(OPMintableERC721Factory)).parseLog(receipt.logs[0])

        return info.args?.localToken;
    }


    return (
        <RolluxPageWrapper
            title="Create token for bridge"
            description="Bridge your L1 token to L2 in a few clicks."
            blockerText={selectedNetwork === SelectedNetworkType.Unsupported ?
                'Please select correct network' : null
            }
        >
            <Box marginBottom={3}>
                <Heading size={'md'} mb={8} textAlign={'center'}>
                    Easily bridge your L1 ERC20/ERC721 token to L2 in just a few clicks!
                </Heading>
            </Box>

            <Box>
                {errorText.length > 0 && <>
                    <Heading marginBottom={3} color={'red.400'} size={'sm'}>
                        {errorText}
                    </Heading>
                </>}
                <Input placeholder="L1 ERC20/ERC721 token address"
                    isInvalid={errorText.length > 0}
                    value={l1Address}
                    onChange={e => handleL1TokenInput(e.target.value)} />


                {(l1Address && tokenDecimals && tokenName && tokenSymbol && tokenStandard === TokenStandard.ERC20) && <>
                    <Box marginTop={3}>
                        <Heading size={'md'} marginTop={3} marginBottom={3}>
                            Token details ERC20
                        </Heading>

                        <VStack
                            divider={<StackDivider borderColor={'grey.400'} />}
                            spacing={4}
                            align={'stretch'}
                        >
                            <Box padding={4}>
                                <Text>
                                    Token name: {tokenName}
                                </Text>
                            </Box>
                            <Box padding={4}>
                                <Text>
                                    Token symbol: {tokenSymbol}
                                </Text>
                            </Box>
                            <Box padding={4} bgColor={tokenDecimals !== 18 ? 'red.100' : undefined}>
                                <Text>
                                    Token decimals: {tokenDecimals}
                                </Text>
                            </Box>
                        </VStack>

                        {tokenDecimals !== 18 && <Alert padding={3} status={'warning'} marginTop={3} borderRadius={5}>
                            <AlertIcon />
                            <AlertDescription>
                                We apologize, but you cannot create an L2 token for the given L1 token using this method because the decimals should be equal to 18.
                                <br />
                                Please consider <Link href="https://github.com/syscoin/optimism-tutorial/tree/main/standard-bridge-custom-token" target={'_blank'} textColor={'blue.400'}>custom token</Link> deployment.
                            </AlertDescription>

                        </Alert>}

                        {tokenDecimals === 18 && <>

                            {!isTokenDeployed && <>
                                <SwitchNetworkButton
                                    onClickSwitch={async () => await switchNetwork(l2ChainId)}
                                    requiredChainId={l2ChainId}
                                >

                                    {!deployState.receipt && <>
                                        <Flex align={'center'} justify={'center'}>
                                            {["PendingSignature", "Mining"].includes(deployState.status) && <Spinner
                                                thickness='4px'
                                                speed='0.65s'
                                                emptyColor='gray.200'
                                                color='green.500'
                                                size='xl'
                                            />}

                                            {['None', 'Exception', 'Success'].includes(deployState.status) && <Button variant={'primary'} width={'35vw'} onClick={() => deployToken()}
                                            >
                                                Deploy L2 token
                                            </Button>
                                            }
                                        </Flex>

                                    </>}

                                </SwitchNetworkButton>
                            </>}
                            {deployState.receipt && <>

                                <Alert status={'success'} marginTop={5} padding={5} borderRadius={'10px'}>
                                    <AlertIcon />
                                    <AlertDescription>
                                        Token deployed to <Link fontFamily={'mono'} target={'_blank'} href={
                                            getExplorerLink(selectedNetwork, 2, 'address', extractDeployedTokenAddress(deployState.receipt) ?? ethers.constants.AddressZero)
                                        }>
                                            {shortenIfAddress(extractDeployedTokenAddress(deployState.receipt))}
                                        </Link>
                                    </AlertDescription>
                                </Alert>
                            </>}
                        </>}



                    </Box>
                </>}

                {(l1Address && tokenName && tokenSymbol && tokenStandard === TokenStandard.ERC721) && <>
                    <Box marginTop={3}>
                        <Heading size={'md'} marginTop={3} marginBottom={3}>
                            Token details ERC721
                        </Heading>

                        <VStack
                            divider={<StackDivider borderColor={'grey.400'} />}
                            spacing={4}
                            align={'stretch'}
                        >
                            <Box padding={4}>
                                <Text>
                                    Token name: {tokenName}
                                </Text>
                            </Box>
                            <Box padding={4}>
                                <Text>
                                    Token symbol: {tokenSymbol}
                                </Text>
                            </Box>
                        </VStack>

                        <Alert padding={3} mb={4} status={'warning'} marginTop={3} borderRadius={5}>
                            <AlertIcon />
                            <AlertDescription>
                                In case if you want to support custom ERC721 functionality,
                                <br />
                                please consider <Link href="https://github.com/syscoin/optimism-tutorial/tree/main/standard-bridge-custom-token" target={'_blank'} textColor={'blue.400'}>custom token</Link> deployment.
                            </AlertDescription>

                        </Alert>


                        {!isTokenDeployed && <>
                            <SwitchNetworkButton
                                onClickSwitch={async () => await switchNetwork(l2ChainId)}
                                requiredChainId={l2ChainId}
                            >
                                {!deployState.receipt && <>
                                    <Flex align={'center'} justify={'center'}>
                                        {["PendingSignature", "Mining"].includes(deployERC721State.status) && <Spinner
                                            thickness='4px'
                                            speed='0.65s'
                                            emptyColor='gray.200'
                                            color='green.500'
                                            size='xl'
                                        />}

                                        {['None', 'Exception', 'Success'].includes(deployERC721State.status) && <Button variant={'primary'} width={'35vw'} onClick={() => deployERC721Token()}
                                        >
                                            Deploy L2 NFT token
                                        </Button>
                                        }
                                    </Flex>

                                </>}

                            </SwitchNetworkButton>
                        </>}



                        {deployERC721State.receipt && <>

                            <Alert status={'success'} marginTop={5} padding={5} borderRadius={'10px'}>
                                <AlertIcon />
                                <AlertDescription>
                                    Token deployed to <Link fontFamily={'mono'} target={'_blank'} href={
                                        getExplorerLink(selectedNetwork, 2, 'address', extractDeployedERC721TokenAddress(deployERC721State.receipt) ?? ethers.constants.AddressZero)
                                    }>
                                        {shortenIfAddress(extractDeployedERC721TokenAddress(deployERC721State.receipt))}
                                    </Link>
                                </AlertDescription>
                            </Alert>
                        </>}




                    </Box>
                </>}
            </Box>
        </RolluxPageWrapper>
    );
}

export default CreateTokenIndex;