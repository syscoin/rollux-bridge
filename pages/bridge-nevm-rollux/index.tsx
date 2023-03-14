import {
    ChakraProvider,
    extendTheme,
    Flex, Heading,
    Highlight, Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    theme,
    VStack
} from '@chakra-ui/react';
import { useConnectedWallet } from "@contexts/ConnectedWallet/useConnectedWallet";
import { useMetamask } from "@contexts/Metamask/Provider";
import { CrossChainMessenger, MessageStatus } from "@eth-optimism/sdk";
import { useEthers } from "@usedapp/core";
import { RolluxChain, TanenbaumChain } from "blockchain/NevmRolluxBridge/config/chainsUseDapp";
import { getNetworkByChainId, getNetworkByName, NetworkData, networks, networksMap } from "blockchain/NevmRolluxBridge/config/networks";
import { crossChainMessengerFactory } from "blockchain/NevmRolluxBridge/factories/CrossChainMessengerFactory";
import { ConnectionWarning } from 'components/ConnectionWarning';
import { RolluxHeader } from 'components/RolluxHeader';
import { BigNumber, ethers } from "ethers";
import { NextPage } from "next";
import { Roboto } from 'next/font/google';
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DepositPart from './_deposit';
import WithdrawPart from './_withdraw';


type BridgeNevmRolluxProps = {}

enum CurrentDisplayView {
    deposit,
    withdraw
}

const roboto = Roboto({
    weight: ['400', '700'],
    subsets: ['latin']
})

const chakraTheme = extendTheme({
    fonts: {
        body: roboto.style.fontFamily,
        heading: roboto.style.fontFamily,
    },
    colors: {
        brand: {
            primary: '#DBEF88',
            primaryGradient: 'linear-gradient(90.06deg, #DBEF88 -3.26%, #EACF5E 207.26%)',
            secondaryGradient: 'linear-gradient(90deg, #E0E0E0 4.05%, #DBEF88 95.38%)'
        }
    },
    components: {
        Button: {
            variants: {
                primary: {
                    bg: 'brand.primaryGradient',
                    _hover: {
                        _disabled: {
                            bg: 'brand.primaryGradient'
                        }
                    }
                },
                secondary: {
                    bg: 'brand.secondaryGradient',
                    _hover: {
                        _disabled: {
                            bg: 'brand.secondaryGradient'
                        }
                    }
                }
            }
        }
    },
    styles: {
        global: {
            'html': {
                height: '100%'
            },
            'body': {
                minHeight: '100%',
            }
        }
    }
})

export const BridgeNevmRollux: NextPage<BridgeNevmRolluxProps> = ({ }) => {
    const router = useRouter();
    const [currentDisplay, setCurrentDisplay] = useState<CurrentDisplayView>(CurrentDisplayView.deposit);
    const metamask = useMetamask();
    const connectedWalletCtxt = useConnectedWallet();
    const isConnected = connectedWalletCtxt.nevm.account;
    const { account, activateBrowserWallet, library, switchNetwork } = useEthers();
    const [crossChainMessenger, setCrossChainMessenger] = useState<CrossChainMessenger | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getCrossChainMessenger = async (library: any, currentDisplay: CurrentDisplayView) => {
        if (!library) {
            console.warn("No library")
            return undefined;
        }


        const w3Provider = library as ethers.providers.JsonRpcProvider;
        const currentChainId: number = await w3Provider.getSigner().getChainId();

        console.log(currentChainId);

        const network: NetworkData | undefined = getNetworkByChainId(currentChainId, networks);

        if (!network) {
            console.warn("Can not detect network")
            return undefined;
        }

        const netMap = networksMap[network.name] ?? undefined;
        console.log(network.name);

        if (!netMap) {
            console.warn("Cant not find net mapping")

            return undefined;
        }

        const secondNetwork: NetworkData | undefined = getNetworkByName(netMap, networks);

        if (!secondNetwork) {
            console.warn("Failed to fetch second network by name");
            return undefined;
        }

        console.log(network, secondNetwork);

        const l1Contracts = network.layer === 1 ? network : secondNetwork;
        const l2Contracts = secondNetwork.layer === 2 ? secondNetwork : network;


        if (currentDisplay === CurrentDisplayView.deposit) {

            return crossChainMessengerFactory(
                l1Contracts,
                l2Contracts,
                w3Provider.getSigner(),
                new ethers.providers.JsonRpcProvider(secondNetwork?.rpcAddress),
                true
            )

        }

        // withdraw

        return crossChainMessengerFactory(
            l1Contracts,
            l2Contracts,
            new ethers.providers.JsonRpcProvider(TanenbaumChain.rpcUrl),
            w3Provider.getSigner(),
            true
        )


    };

    const handleERC20Approval = async (l1Token: string, l2Token: string, amount: BigNumber) => {
        if (!library) {
            console.warn("approval:no-library")
            return; // not connected wallet
        }

        if (!crossChainMessenger) {
            console.warn("approval:no-messenger")
            return; // no messenger initialized
        }

        try {
            await crossChainMessenger.approveERC20(l1Token, l2Token, amount);

            setIsLoading(false);
        } catch (e) {
            console.log(e);
            setIsLoading(false);
        }
    }

    const handleERC20Deposit = async (l1Token: string, l2Token: string, amount: BigNumber) => {
        if (!library || !crossChainMessenger) {
            return; // not connected or not initialized
        }

        try {
            const tx = await crossChainMessenger.depositERC20(l1Token, l2Token, amount);
            await tx.wait();

            await crossChainMessenger.waitForMessageStatus(tx.hash,
                MessageStatus.RELAYED)

            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
        }

        // if success

    }

    const handleWithdrawMainCurrency = async (amount: string) => {
        if (!library || !crossChainMessenger) {
            console.log('no lib or messenger')
            return;
        }

        try {
            // const withdrawTx = await crossChainMessenger.withdrawETH(
            //     ethers.utils.parseEther(amount)
            // );

            // await withdrawTx.wait();

            const withdrawTx = {
                hash: '0x957e9cfbf261fb404e31c34645986c081b3983890f61a26d9d1ac8b778dc4cc4',
            }

            console.log('waited 1');


            await crossChainMessenger.waitForMessageStatus(withdrawTx.hash,
                MessageStatus.READY_TO_PROVE)

            console.log('status message #1');

            await switchNetwork(5700);

            const messengerL1 = crossChainMessengerFactory(
                networks.L1Dev,
                networks.L2Dev,
                (library as ethers.providers.JsonRpcProvider).getSigner(),
                new ethers.providers.JsonRpcProvider(RolluxChain.rpcUrl),
                true
            );


            const proveTx = await messengerL1.proveMessage(withdrawTx.hash);

            await proveTx.wait();

            console.log(proveTx);

            console.log('wait 2');

            await messengerL1.waitForMessageStatus(withdrawTx.hash,
                MessageStatus.READY_FOR_RELAY)

            console.log('wait3');



            // 1st step = 2h / 2nd step = 25m / 3rd = 5m


            const finalizeTx = await messengerL1.finalizeMessage(withdrawTx.hash);

            await finalizeTx.wait();


        } catch (e) {
            console.log(`Withdraw SYS failed. Error - ${e}`)
        }
    }

    const handleDepositMainCurrency = async (amount: string) => {
        if (!library) {
            return;
        }

        if (crossChainMessenger) {
            try {

                setIsLoading(true);

                const depositTx = await crossChainMessenger.depositETH(
                    ethers.utils.parseEther(amount)
                );

                const confirmation = await crossChainMessenger.waitForMessageReceipt(depositTx);

                if (confirmation.receiptStatus === 1) {
                    console.log('OK')

                    setIsLoading(false);
                } else {
                    console.log('Error');
                    console.log(confirmation);
                    setIsLoading(false);
                }
            } catch (e) {
                setIsLoading(false);
                console.log(e);
            }

        }

    }

    const switchAction = (action: CurrentDisplayView) => {
        setCurrentDisplay(action);
    }

    /**
     * 
     * Hack for use useDapp
     * 
     * todo : refactor whole app to useDapp instead of web3-react
     */
    useEffect(() => {
        if (!account && connectedWalletCtxt.nevm.account) {
            activateBrowserWallet()
        }
    }, [account, activateBrowserWallet, connectedWalletCtxt.nevm.account]);

    useEffect(() => {
        getCrossChainMessenger(library, currentDisplay).then((messenger) => {
            console.log(messenger);
            setCrossChainMessenger(messenger);
        })

        /// load txns for withdrawals which're pending if current display is for withdrawal

        if (currentDisplay === CurrentDisplayView.withdraw) {

        }
    }, [library, currentDisplay])

    // const {logs} = useLogs(
    //     {contract: new ethers.Contract(crossChainMessenger?.contracts.l2.L2StandardBridge, )}
    // )

    return (

        <ChakraProvider theme={chakraTheme}>
            <Head>
                <title>Syscoin Bridge | Rollux & NEVM </title>
                <link rel="shortcut icon" href="/favicon.ico" />
                <meta name="description" content="Syscoin Trustless Bridge" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <RolluxHeader />

            <VStack spacing={{ base: '-20', xl: '0' }} pb="50px">
                <Flex
                    id="bg"
                    boxSize={{ base: undefined, xl: '100%' }}
                    overflow="visible"
                    position={{ base: 'initial', xl: 'absolute' }}
                    bg="#28282F"
                    top="0"
                    p={{ base: '16px', xl: '100px' }}
                    clipPath={{
                        base: undefined,
                        xl: 'polygon(0% -15%, 100% 120%, 100% 100%, 0% 100%)',
                    }}
                    pb={{ base: '103px', xl: '100px' }}
                    zIndex={-1}
                    w="100%"
                >
                    <Heading
                        color="white"
                        fontSize={{ base: '33px', xl: '5xl' }}
                        maxW={{ base: '300px', md: '400px' }}
                        lineHeight="135.69%"
                        position={{ base: 'initial', xl: 'absolute' }}
                        top="50%"
                        right="65%"
                        w="100%"
                        transform={{ base: undefined, xl: 'translateY(-50%)' }}
                        m="0 auto"
                    >
                        <Highlight
                            query={['L1 NEVM', 'L2 Rollux']}
                            styles={{ bg: 'brand.primary', textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
                        >
                            Bridge your $ SYS between L1 NEVM and L2 Rollux
                        </Highlight>
                    </Heading>
                </Flex>

                <Flex
                    as="main"
                    position={{ base: 'initial', xl: 'absolute' }}
                    top="50%"
                    left="60%"
                    transform={{ base: undefined, xl: 'translate(-50%, -50%)' }}
                    p={{ base: '16px' }}
                    mt={{ base: '9', xl: 0 }}
                    flexDir="column"
                    maxW="483px"
                    w={{ base: '100%', md: '483px' }}
                    gap="21px"
                >
                    <Flex
                        px={{ base: '16px', md: '40px' }}
                        py={{ base: '16px', md: '32px' }}
                        flex={1}
                        bg="white"
                        boxShadow={`7px 7px ${chakraTheme.colors.brand.primary}`}
                        borderRadius="12px"
                        border={`1px solid ${chakraTheme.colors.brand.primary}`}
                        justifyContent="center"
                        flexDir="column"
                        m="0 auto"
                    >
                        <Tabs variant="soft-rounded" w="100%" onChange={(index) => setCurrentDisplay(index === 0 ? CurrentDisplayView.deposit : CurrentDisplayView.withdraw)}>
                            <TabList justifyContent="center" bg="#f4fadb" w="max-content" m="0 auto" borderRadius="6px">
                                <Tab
                                    borderRadius="6px"
                                    px="36px"
                                    _selected={{
                                        color: '#000',
                                        bg: 'brand.secondaryGradient',
                                    }}
                                >
                                    Deposit
                                </Tab>
                                <Tab
                                    px="36px"
                                    borderRadius="6px"
                                    _selected={{
                                        color: '#000',
                                        bg: 'brand.secondaryGradient',
                                    }}
                                >
                                    Withdraw
                                </Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel p={{ base: '32px 0 0 0', md: '43px 0 0 0' }}>
                                    <DepositPart
                                        onClickDepositButton={(amount: string, tokenAddress: string | undefined) => {
                                            if (!tokenAddress) {
                                                handleDepositMainCurrency(amount);
                                            }
                                        }}
                                        onClickApproveERC20={(l1Token: string, l2Token: string, amount: BigNumber) => {
                                            handleERC20Approval(l1Token, l2Token, amount);
                                        }}

                                        onClickDepositERC20={(l1Token: string, l2Token: string, amount: BigNumber) => {
                                            handleERC20Deposit(l1Token, l2Token, amount);
                                        }}

                                        setIsLoading={setIsLoading}

                                        L1StandardBridgeAddress="0x77Cdc3891C91729dc9fdea7000ef78ea331cb34A"
                                    />
                                </TabPanel>

                                <TabPanel p={{ base: '32px 0 0 0', md: '43px 0 0 0' }}>
                                    <WithdrawPart
                                        onClickWithdrawButton={(amount) => {
                                            console.log(amount);
                                            handleWithdrawMainCurrency(amount);
                                        }}
                                        onClickWithdrawERC20={(l1Token, l2Token, amount) => { }}
                                        setIsLoading={setIsLoading}
                                        L1StandardBridgeAddress="0x77Cdc3891C91729dc9fdea7000ef78ea331cb34A"
                                    />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Flex>

                    {!isConnected && <ConnectionWarning />}
                </Flex>
            </VStack>

        </ChakraProvider>
    )
}

export default BridgeNevmRollux;
