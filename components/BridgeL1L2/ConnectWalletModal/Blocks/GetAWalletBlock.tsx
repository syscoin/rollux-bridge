import React, { FC, useEffect, useState } from "react"
import {
    ModalHeader,
    HStack,
    Divider,
    IconButton,
    Spacer,
    Text,
    ModalBody,
    Button,
    VStack,
    ModalCloseButton,
    Box,
    Heading,

} from "@chakra-ui/react"

import {
    QuestionIcon,
    CloseIcon,
    ArrowBackIcon,
    LockIcon,
    ArrowRightIcon
} from "@chakra-ui/icons"
import CloseButton from "../CloseButton";
import BackButton from "../BackButton";
import Image from "next/image";

export type GetAWalletBlockProps = {
    setScreen: (value: string) => void;
    onClose: () => void;
}


const wallets = [
    {
        name: 'Pali Wallet',
        description: 'Mobile Wallet and Extension',
        image: '/wallets/Pali.svg',
        extensionLink: 'https://paliwallet.com/',
        mobileLink: 'https://paliwallet.com/',

    },
    {
        name: 'MetaMask',
        description: 'Mobile Wallet and Extension',
        image: '/wallets/Metamask.svg',
        extensionLink: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en',
        mobileLink: 'https://metamask.io/download.html',

    },
    {
        name: 'Coinbase Wallet',
        description: 'Mobile Wallet and Extension',
        image: '/wallets/Coinbase.svg',
        extensionLink: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en', // @todo replace with coinbase link
        mobileLink: 'https://metamask.io/download.html', // @todo replace with coinbase link
    },
    {
        name: 'Rainbow',
        description: 'Mobile Wallet and Extension',
        image: '/wallets/Rainbow.svg',
        extensionLink: 'https://rainbow.me/extension?utm_source=rainbowkit',
        mobileLink: 'https://rainbow.me/',

    },
];

export const GetAWalletBlock: FC<GetAWalletBlockProps> = ({ setScreen, onClose }) => {

    const [selectedGetWallet, setSelectedGetWallet] = useState<string>('');
    const [selectedWalletInfo, setSelectedWalletInfo] = useState<{
        name: string;
        description: string;
        image: string;
        extensionLink: string;
        mobileLink: string;
    } | undefined>(undefined);

    useEffect(() => {
        if (selectedGetWallet) {
            setSelectedWalletInfo(wallets.find((wallet) => wallet.name === selectedGetWallet));
        }
    }, [selectedGetWallet]);

    if (selectedGetWallet && selectedWalletInfo) {


        return (<>
            <ModalHeader>
                <HStack spacing={4}>
                    <BackButton setScreen={setScreen} onClick={() => {
                        setSelectedGetWallet('');
                    }} screen={'get-wallet'} />
                    <Spacer />
                    <Text textAlign={'center'}>Get a {selectedWalletInfo.name}</Text>
                    <Spacer />
                    <CloseButton onClose={onClose} setScreen={setScreen} />
                </HStack>
            </ModalHeader>
            <Divider />
            <ModalBody>
                <HStack spacing={4} mb={3}>
                    <Image style={{ 'borderRadius': '15px' }} src={selectedWalletInfo.image} width={50} height={50} alt={selectedWalletInfo.name} />
                    <Box>
                        <Heading size="sm">{selectedWalletInfo.name}</Heading>
                        <Text>{selectedWalletInfo.description}</Text>
                    </Box>
                </HStack>
                <HStack spacing={4}>
                    <Button w={'100%'} variant={'secondary'} onClick={() => {
                        window.open(selectedWalletInfo.extensionLink, '_blank');
                    }} colorScheme="blue">
                        <ArrowRightIcon mr={2} />
                        Get Extension
                    </Button>
                    <Spacer />
                    <Button w={'100%'} variant={'secondary'} onClick={() => {
                        window.open(selectedWalletInfo.mobileLink, '_blank');
                    }} colorScheme="blue">
                        <ArrowRightIcon mr={2} />
                        Get Mobile
                    </Button>
                </HStack>
            </ModalBody>
        </>);
    }
    return (<>
        <ModalHeader>
            <HStack spacing={4}>
                <BackButton setScreen={setScreen} screen={'help'} />
                <Spacer />
                <Text textAlign={'center'}>Get a Wallet</Text>
                <Spacer />
                <CloseButton onClose={onClose} setScreen={setScreen} />
            </HStack>
        </ModalHeader>
        <Divider />
        <ModalBody>
            {wallets.map((wallet) => {
                return (<HStack spacing={4} mb={3} key={`wallet-item-${wallet.name}`}>
                    <Image style={{ 'borderRadius': '15px' }} src={wallet.image} width={50} height={50} alt={wallet.name} />
                    <Spacer />
                    <Box>
                        <Heading size="sm">{wallet.name}</Heading>
                        <Text>{wallet.description}</Text>
                    </Box>
                    <Spacer />
                    <Button onClick={() => setSelectedGetWallet(wallet.name)} colorScheme="blue">Get</Button>
                </HStack>);
            })}
        </ModalBody>

    </>);

}