import {
    ChakraProvider,
    Flex, Grid, Heading,
    Highlight, Icon, Spinner, Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useDisclosure,
    useToast,
    VStack
} from '@chakra-ui/react';
import { chakraTheme } from 'components/chakraTheme';
import { CrossChainMessenger, MessageStatus } from "@eth-optimism/sdk";
import { useEthers, useSigner } from "@usedapp/core";
import { getNetworkByChainId, getNetworkByName, NetworkData, networks, networksMap, SelectedNetworkType } from "blockchain/NevmRolluxBridge/config/networks";
import { crossChainMessengerFactory } from "blockchain/NevmRolluxBridge/factories/CrossChainMessengerFactory";
import { ConnectionWarning } from 'components/ConnectionWarning';
import { BigNumber, Contract, ethers } from "ethers";
import { RolluxHeader } from 'components/RolluxHeader';
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import DepositPart from 'components/BridgeL1L2/Standard/_deposit';
import WithdrawPart from 'components/BridgeL1L2/Standard/_withdraw';
import L2StandardBridgeABI from "blockchain/NevmRolluxBridge/abi/L2StandardBridge"
import UnfinishedWithdrawalItem from 'components/BridgeL1L2/Withdraw/UnfinishedWithdrawalItem';
import ViewWithdrawalModal from 'components/BridgeL1L2/Withdraw/ViewWithdrawalModal';
import ProveMessageStep from 'components/BridgeL1L2/Withdraw/Steps/ProveMessageStep';
import { useLocalStorage } from 'usehooks-ts';
import RelayMessageStep from 'components/BridgeL1L2/Withdraw/Steps/RelayMessageStep';
import { PendingMessage } from 'components/BridgeL1L2/Withdraw/Steps/PendingMessage';
import { useSelectedNetwork } from "hooks/rolluxBridge/useSelectedNetwork"
import { useCrossChainMessenger } from 'hooks/rolluxBridge/useCrossChainMessenger';
import Coinify from 'components/BridgeL1L2/Coinify/Coinify';
import Chainge from 'components/BridgeL1L2/Chainge/Chainge';
import { CurrentDisplayView } from "components/BridgeL1L2/interfaces"
import { OtherProvidersListing } from 'components/BridgeL1L2/OtherProviders/OtherProvidersListing';
import { BridgedNetwork, FiatOrBridged } from 'blockchain/NevmRolluxBridge/bridgeProviders/types';
import { BridgeTypeSelector } from 'components/BridgeL1L2/Withdraw/BridgeTypeSelector';
import { ArrowRightIcon } from '@chakra-ui/icons';
import { MdShield, MdRunCircle } from "react-icons/md";


type BridgeNevmRolluxProps = {}




export const BridgeNevmRollux: NextPage<BridgeNevmRolluxProps> = ({ }) => {
    const router = useRouter();
    const [currentDisplay, setCurrentDisplay] = useState<CurrentDisplayView>(CurrentDisplayView.deposit);
    // const metamask = useMetamask();
    // const connectedWalletCtxt = useConnectedWallet();
    // const isConnected = connectedWalletCtxt.nevm.account;
    const { account, activateBrowserWallet, library, switchNetwork, chainId } = useEthers();
    const [crossChainMessenger, setCrossChainMessenger] = useState<CrossChainMessenger | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [unfinishedWithdrawals, setUnfinishedWithdrawals] = useState<{ status: MessageStatus, txHash: string }[]>([])

    const { isOpen: withdrawIsOpen, onOpen: withdrawOnOpen, onClose: widthdrawOnClose } = useDisclosure();
    const toast = useToast();
    const [withdrawalModalData, setWithdrawalModalData] = useState<{ status: MessageStatus, txHash: string }>({ status: 0, txHash: '' });
    const signer = useSigner();
    // [{withdrawTx, proveTx}]
    const [proveTxns, setProveTxns] = useLocalStorage<{ withdrawTx: string, proveTx: string }[]>('prove-txns', []);
    const [relayTxns, setRelayTxns] = useLocalStorage<{ withdrawTx: string, relayTx: string }[]>('relay-txns', []);

    const { contractsL1, contractsL2, l1ChainId, l2ChainId, rpcL1, rpcL2, selectedNetwork } = useSelectedNetwork();
    const hookedMessenger = useCrossChainMessenger();

    const [showOtherProviders, setShowOtherProviders] = useState<boolean>(false);
    const [selectedIOCurrency, setSelectedIOCurrency] = useState<string>('SYS');

    const [tablIndex, setTabIndex] = useState<number>(0);

    // todo refactor this 2 similar functions
    const getProveTxn = (withdrawTxHash: string, data: { withdrawTx: string, proveTx: string }[]): string | null => {
        try {

            const target = data.find(item => item.withdrawTx === withdrawTxHash);

            if (target) {
                return target.proveTx ?? null;
            }
        } catch {
            return null;
        }

        return null;
    }

    const getRelayTxn = (withdrawTxHash: string, data: { withdrawTx: string, relayTx: string }[]): string | null => {
        try {

            const target = data.find(item => item.withdrawTx === withdrawTxHash);

            if (target) {
                return target.relayTx ?? null;
            }
        } catch {
            return null;
        }

        return null;
    }


    const getCrossChainMessenger = useCallback(async (signer: ethers.providers.JsonRpcSigner | undefined, currentDisplay: CurrentDisplayView) => {
        if (!signer) {
            console.warn("No Signer")
            return undefined;
        }

        const currentChainId: number = await signer.getChainId();

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

        const l1Contracts = network.layer === 1 ? network : secondNetwork;
        const l2Contracts = secondNetwork.layer === 2 ? secondNetwork : network;


        if (currentDisplay === CurrentDisplayView.deposit) {

            return crossChainMessengerFactory(
                l1Contracts,
                l2Contracts,
                signer,
                new ethers.providers.JsonRpcProvider(secondNetwork?.rpcAddress),
                true
            )

        }

        // withdraw

        return crossChainMessengerFactory(
            l1Contracts,
            l2Contracts,
            new ethers.providers.JsonRpcProvider(rpcL1),
            signer,
            true
        )


    }, [rpcL1]);

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

            toast({
                title: 'Approve ERC20.',
                description: "Initialising approval transaction",
                status: 'info',
                duration: 9000,
                isClosable: true,
            })

            await crossChainMessenger.approveERC20(l1Token, l2Token, amount);

            toast({
                title: 'Approve ERC20.',
                description: "Approval transaction sent.",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })

            setIsLoading(false);
        } catch (e) {
            console.log(e);
            toast({
                title: 'Approve ERC20 error.',
                description: "Approval transaction error.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            setIsLoading(false);
        }
    }

    const handleERC20Deposit = async (l1Token: string, l2Token: string, amount: BigNumber) => {
        if (!library || !crossChainMessenger) {
            toast({
                title: 'Error.',
                description: "Wallet not connected.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            return; // not connected or not initialized
        }

        try {
            toast({
                title: 'Deposit.',
                description: "Initialising deposit transaction",
                status: 'info',
                duration: 9000,
                isClosable: true,
            })
            const tx = await crossChainMessenger.depositERC20(l1Token, l2Token, amount);

            toast({
                title: 'Deposit confirmation.',
                description: "Waiting for deposit confirmation",
                status: 'info',
                isClosable: false,
            })

            await tx.wait();
            await crossChainMessenger.waitForMessageStatus(tx.hash,
                MessageStatus.RELAYED)

            toast({
                title: 'Deposit confirmed.',
                description: "Your deposit was confirmed",
                status: 'success',
                isClosable: false,
            })

            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
        }

        // if success

    }

    const updateWithdrawalLogs = async () => {
        widthdrawalsLogs().then(results => {
            if (results) {
                setUnfinishedWithdrawals(results.filter((value) => {
                    return value.status !== MessageStatus.RELAYED;
                }))
            }
        })
    }

    const handleWithdrawMainCurrency = async (amount: string) => {
        if (!library || !crossChainMessenger) {
            console.log('no lib or messenger')
            toast({
                title: 'Error.',
                description: "Wallet not connected.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            return;
        }

        try {

            toast({
                title: 'Withdraw.',
                description: "Initialising withdrawal transaction",
                status: 'info',
                duration: 9000,
                isClosable: true,
            })
            const withdrawTx = await crossChainMessenger.withdrawETH(
                ethers.utils.parseEther(amount)
            );

            toast({
                title: 'Withdraw.',
                description: "Withdraw tx sent.",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })

            await withdrawTx.wait();

            await updateWithdrawalLogs();

        } catch (e) {
            console.log(`Withdraw SYS failed. Error - ${e}`)

            toast({
                title: 'Withdraw.',
                description: "Error.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }

    const handleDepositMainCurrency = async (amount: string) => {
        if (!library) {
            toast({
                title: 'Error.',
                description: "Wallet not connected.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            return;
        }

        if (crossChainMessenger) {
            try {

                setIsLoading(true);

                toast({
                    title: 'Deposit.',
                    description: "Initialising deposit transaction",
                    status: 'info',
                    duration: 9000,
                    isClosable: true,
                })

                const depositTx = await crossChainMessenger.depositETH(
                    ethers.utils.parseEther(amount)
                );

                const _confirmationToast = toast({
                    title: 'Deposit confirmation.',
                    description: "Waiting for deposit confirmation",
                    status: 'info',
                    isClosable: false,
                })

                const confirmation = await crossChainMessenger.waitForMessageReceipt(depositTx);


                toast.close(_confirmationToast);
                if (confirmation.receiptStatus === 1) {



                    toast({
                        title: 'Deposit success.',
                        description: "Your deposit confirmed",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    })

                    setIsLoading(false);
                } else {

                    toast({
                        title: 'Deposit error.',
                        description: "Deposit failed.",
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })

                    console.log('Deposit error');
                    console.log(confirmation);
                    setIsLoading(false);
                }
            } catch (e) {
                setIsLoading(false);
                toast({
                    title: 'Deposit error.',
                    description: "Deposit failed.",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
                console.log(e);
            }

        }

    }


    const handleWithdrawERC20Token = async (l1Token: string, l2Token: string, amount: BigNumber) => {
        if (!library || !crossChainMessenger) {
            toast({
                title: 'Error.',
                description: "Wallet not connected.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            return false;
        }

        try {
            setIsLoading(true);

            console.log(l1Token, l2Token);

            toast({
                title: 'Withdraw.',
                description: "Initialising withdrawal transaction",
                status: 'info',
                duration: 9000,
                isClosable: true,
            })


            const withDrawERC20Tx = await crossChainMessenger.withdrawERC20(
                l1Token, l2Token, amount
            );

            await withDrawERC20Tx.wait();

            toast({
                title: 'Withdraw.',
                description: "Withdraw tx sent.",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })

            await updateWithdrawalLogs();

        } catch (e) {
            console.log(`Error when withdrawing ERC20 - ${e}`);

            toast({
                title: 'Withdraw.',
                description: "Error.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })

            setIsLoading(false);
        }
    }

    /**
     *
     * Hack for use useDapp
     *
     * todo : refactor whole app to useDapp instead of web3-react
     */
    // useEffect(() => {
    //     if (!account && connectedWalletCtxt.nevm.account) {
    //         activateBrowserWallet()
    //     }
    // }, [account, activateBrowserWallet, connectedWalletCtxt.nevm.account]);

    useEffect(() => {

        if (!account) {
            console.log('No account connected');

            return;
        }

        getCrossChainMessenger(signer, currentDisplay).then((messenger) => {

            setCrossChainMessenger(messenger);
        })
    }, [signer, account, currentDisplay, getCrossChainMessenger])




    const widthdrawalsLogs = useCallback(async () => {
        if (currentDisplay === CurrentDisplayView.withdraw && account && selectedNetwork !== SelectedNetworkType.Unsupported) {
            // check for withdrawals

            const L2BridgeContract = new Contract(
                contractsL2?.L2StandardBridge ?? ethers.constants.AddressZero,
                new ethers.utils.Interface(L2StandardBridgeABI),
                new ethers.providers.StaticJsonRpcProvider(rpcL2)
            )

            const filter = L2BridgeContract.filters['WithdrawalInitiated'](null, null, account)

            const events = await L2BridgeContract.queryFilter(filter);

            if (events.length > 0) {
                const messengerL1 = crossChainMessengerFactory(
                    selectedNetwork === SelectedNetworkType.Testnet ? networks.L1Dev : networks.L1,
                    selectedNetwork === SelectedNetworkType.Testnet ? networks.L2Dev : networks.L2,
                    new ethers.providers.StaticJsonRpcProvider(rpcL1),
                    new ethers.providers.JsonRpcProvider(rpcL2),
                    true
                );

                const checks = await Promise.all(events.map(async (value) => {
                    const status = await messengerL1.getMessageStatus(value.transactionHash)

                    return { status: status, txHash: value.transactionHash };
                }))
                return checks;
            }

            return [];


        }
    }, [currentDisplay, account, rpcL1, rpcL2, selectedNetwork, contractsL2])

    useEffect(() => {
        const loadWithdrawalLogs = () => {
            widthdrawalsLogs().then(results => {
                if (results) {
                    setUnfinishedWithdrawals(results.filter((value) => {
                        return value.status !== MessageStatus.RELAYED;
                    }))
                }
            })
        }

        loadWithdrawalLogs();
        // const intervalId = setInterval(loadWithdrawalLogs, 10000)
        // return () => clearInterval(intervalId)
    }, [widthdrawalsLogs])



    const handleSwitchProviders = (selectedIOCurrency: string, force: boolean) => {

        if (force === true) {
            setShowOtherProviders(true);
            setSelectedIOCurrency(selectedIOCurrency);

        } else {

            if (selectedIOCurrency !== BridgedNetwork.SYS) {
                // if its sys we just want to display message about ability to use third party provider
                setShowOtherProviders(true)

            }

            setSelectedIOCurrency(selectedIOCurrency);
        }
    }

    return (

        <ChakraProvider theme={chakraTheme}>
            <Head>
                <title>Syscoin Bridge | Rollux & NEVM </title>
                <link rel="shortcut icon" href="/favicon-rollux.ico" />
                <meta name="description" content="Syscoin Trustless Bridge" />
                <link rel="icon" href="/favicon-rollux.ico" />
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
                    maxW={{ 'sm': '520px', base: '583px' }}
                    minW={{ 'sm': '350px', base: '383px' }}
                    gap="21px"
                    className="main_container"
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
                        className="tabs_dw"
                    >
                        <Tabs
                            variant="soft-rounded"
                            onChange={(index) => {
                                setCurrentDisplay(index === 0 ? CurrentDisplayView.deposit : CurrentDisplayView.withdraw)

                                setTabIndex(index)
                            }}
                            index={tablIndex}
                        >

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
                                    {/* <SwitcherOtherProviders onSwitch={handleSwitchProvidrs} /> */}

                                    {showOtherProviders === true ?
                                        <OtherProvidersListing
                                            currentView={currentDisplay}
                                            selectedIOCurrency={selectedIOCurrency}
                                            onClickUseStandardBridge={() => {
                                                setShowOtherProviders(false);
                                                setSelectedIOCurrency(BridgedNetwork.SYS);
                                            }}
                                        />
                                        :

                                        <DepositPart
                                            onSwapDirection={() => {
                                                setTabIndex(1);
                                                setCurrentDisplay(CurrentDisplayView.withdraw);
                                            }}
                                            onSelectBridgeProvider={(bridgeProvider: string, force: boolean) => {
                                                handleSwitchProviders(bridgeProvider, force);
                                            }}
                                            onClickDepositButton={(amount: string) => {
                                                handleDepositMainCurrency(amount);
                                            }}
                                            onClickApproveERC20={(l1Token: string, l2Token: string, amount: BigNumber) => {
                                                handleERC20Approval(l1Token, l2Token, amount);
                                            }}

                                            onClickDepositERC20={(l1Token: string, l2Token: string, amount: BigNumber) => {

                                                console.log(l1Token, l2Token, amount);
                                                handleERC20Deposit(l1Token, l2Token, amount);
                                            }}

                                            setIsLoading={setIsLoading}
                                        />
                                    }



                                </TabPanel>

                                <TabPanel p={{ base: '32px 0 0 0', md: '43px 0 0 0' }}>

                                    {/* <SwitcherOtherProviders onSwitch={((enabled) => setShowOtherProviders(enabled))} /> */}

                                    <BridgeTypeSelector onSelected={() => {
                                        handleSwitchProviders('SYS', true);
                                    }}
                                        label="Use a third party bridge"
                                        icon={<Icon as={MdRunCircle} />}
                                        description="This usually takes under 20min. Bridge to multiple chains, limited to certain tokens."
                                        defaultChecked={showOtherProviders === true}
                                    />

                                    <BridgeTypeSelector onSelected={() => {
                                        setShowOtherProviders(false);
                                    }}
                                        label="Use the official bridge"
                                        icon={<Icon as={MdShield} />}
                                        description="This usually takes 7days. Bridge any token to Syscoin NEVM."
                                        defaultChecked={showOtherProviders === false}
                                    />

                                    {showOtherProviders === true ? <OtherProvidersListing
                                        selectedIOCurrency={selectedIOCurrency}
                                        currentView={currentDisplay}
                                        onClickUseStandardBridge={() => {
                                            setShowOtherProviders(false);
                                            setSelectedIOCurrency(BridgedNetwork.SYS);
                                        }}
                                    /> :
                                        <>
                                            {unfinishedWithdrawals.length > 0 && <>

                                                {withdrawalModalData.txHash !== '' && <>
                                                    <ViewWithdrawalModal isOpen={withdrawIsOpen} onClose={widthdrawOnClose}
                                                        status={withdrawalModalData.status}
                                                        txnHash={withdrawalModalData.txHash}
                                                    >
                                                        {[MessageStatus.IN_CHALLENGE_PERIOD, MessageStatus.STATE_ROOT_NOT_PUBLISHED, MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE].includes(withdrawalModalData.status) && <>
                                                            <PendingMessage status={withdrawalModalData.status} waitTime={0} />
                                                        </>}


                                                        {withdrawalModalData.status === MessageStatus.READY_TO_PROVE && <>
                                                            <ProveMessageStep
                                                                chainId={chainId || 1}
                                                                proveTxHash={getProveTxn(withdrawalModalData.txHash, proveTxns) ?? ''}
                                                                requiredChainId={l1ChainId}
                                                                onClickProveMessage={async () => {
                                                                    if (!signer) {
                                                                        return;
                                                                    }

                                                                    if (!hookedMessenger) {
                                                                        console.warn('Failed to init cm. ')

                                                                        return;
                                                                    }

                                                                    // const messengerL1 = crossChainMessengerFactory(
                                                                    //     networks.L1Dev,
                                                                    //     networks.L2Dev,
                                                                    //     signer,
                                                                    //     new ethers.providers.JsonRpcProvider(rpcL2),
                                                                    //     true
                                                                    // );

                                                                    const messengerL1 = hookedMessenger;

                                                                    const _tx = await (new ethers.providers.JsonRpcProvider(rpcL2)).getTransaction(withdrawalModalData.txHash);

                                                                    const proveTx = await messengerL1.proveMessage(_tx);

                                                                    const tmpProven = [...proveTxns]
                                                                    tmpProven.push({ withdrawTx: withdrawalModalData.txHash, proveTx: proveTx.hash });

                                                                    setProveTxns([...tmpProven]);
                                                                }}
                                                                onClickSwitchNetwork={async () => {
                                                                    await switchNetwork(l1ChainId)
                                                                }}
                                                            />
                                                        </>}

                                                        {withdrawalModalData.status === MessageStatus.READY_FOR_RELAY && <>
                                                            <RelayMessageStep
                                                                chainId={chainId || 1}
                                                                relayTxHash={getRelayTxn(withdrawalModalData.txHash, relayTxns) ?? ''}
                                                                requiredChainId={l1ChainId}
                                                                onClickRelayMessage={async () => {
                                                                    if (!signer) {
                                                                        return;
                                                                    }

                                                                    if (!hookedMessenger) {
                                                                        console.warn('Failed to init cm. ')

                                                                        return;
                                                                    }

                                                                    // const messengerL1 = crossChainMessengerFactory(
                                                                    //     networks.L1Dev,
                                                                    //     networks.L2Dev,
                                                                    //     signer,
                                                                    //     new ethers.providers.JsonRpcProvider(rpcL2),
                                                                    //     true
                                                                    // );

                                                                    const messengerL1 = hookedMessenger;

                                                                    const relayTx = await messengerL1.finalizeMessage(withdrawalModalData.txHash);

                                                                    const tmpRelayed = [...relayTxns]
                                                                    tmpRelayed.push({ withdrawTx: withdrawalModalData.txHash, relayTx: relayTx.hash });

                                                                    setRelayTxns([...tmpRelayed]);
                                                                }}
                                                                onClickSwitchNetwork={async () => {
                                                                    await switchNetwork(l1ChainId)
                                                                }}
                                                            />
                                                        </>}


                                                    </ViewWithdrawalModal>
                                                </>}


                                                <Flex
                                                    px={{ base: '8px', md: '20px' }}
                                                    py={{ base: '8px', md: '16px' }}
                                                    flex={1}
                                                    bg="white"
                                                    boxShadow={`7px 7px ${chakraTheme.colors.brand.primary}`}
                                                    borderRadius="12px"
                                                    border={`1px solid ${chakraTheme.colors.brand.primary}`}
                                                    justifyContent="center"
                                                    flexDir="column"
                                                    m="0 0 30px 0"
                                                    maxW="380px"
                                                    maxH={"400px"}
                                                    overflow={"scroll-y"}
                                                >
                                                    <Heading size="s" sx={{ marginBottom: 5 }}>
                                                        You have unfinished withdrawals
                                                    </Heading>
                                                    {unfinishedWithdrawals.map((item) => {
                                                        return <UnfinishedWithdrawalItem key={item.txHash} status={item.status} txHash={item.txHash}
                                                            onClickView={() => {
                                                                setWithdrawalModalData({
                                                                    status: item.status,
                                                                    txHash: item.txHash
                                                                })


                                                                withdrawOnOpen();
                                                            }}
                                                        />
                                                    })}
                                                </Flex>

                                            </>}




                                            <WithdrawPart
                                                onSwapDirection={() => {
                                                    setTabIndex(0);
                                                    setCurrentDisplay(CurrentDisplayView.deposit);
                                                }}
                                                onSelectBridgeProvider={(bridgeProvider: string, force: boolean) => {
                                                    handleSwitchProviders(bridgeProvider, force);
                                                }}
                                                onClickWithdrawButton={(amount) => {
                                                    handleWithdrawMainCurrency(amount);
                                                }}
                                                onClickWithdrawERC20={(_l1Token, _l2Token, amount) => {
                                                    handleWithdrawERC20Token(_l1Token, _l2Token, amount);
                                                }}
                                                setIsLoading={setIsLoading}

                                            />
                                        </>
                                    }


                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Flex>

                    {!account && <ConnectionWarning />}
                </Flex>
            </VStack>

        </ChakraProvider >
    )
}

export default BridgeNevmRollux;