import { ArrowBackIcon, ArrowForwardIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Avatar, Button, ButtonGroup, ButtonProps, Box, Flex, List, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, VStack, Heading, StackDivider, Link, Spacer } from "@chakra-ui/react"
// import { useConnectedWallet } from "@contexts/ConnectedWallet/useConnectedWallet";
import { useEtherBalance, useEthers, useSigner } from "@usedapp/core";
import { RolluxChain, TanenbaumChain, networks, NEVMChain, RolluxChainMainnet } from "blockchain/NevmRolluxBridge/config/chainsUseDapp";
import { SelectedNetworkType } from "blockchain/NevmRolluxBridge/config/networks";
import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useSelectedNetwork } from "hooks/rolluxBridge/useSelectedNetwork";
import { useCallback, useEffect, useState } from "react";
import NextLink from "next/link"
//@ts-ignore
import { createIcon } from '@download/blockies';
import { ConnectWalletModal } from "./BridgeL1L2/ConnectWalletModal/ConnectWalletModal";
// import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';

interface ConnectButtonProps extends ButtonProps {
}

interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({ ...rest }) => {
  const { isOpen: isOpenConnect, onClose: onCloseConnect, onOpen: onOpenConnect } = useDisclosure()

  const { account, deactivate, switchNetwork, library } = useEthers();
  const { selectedNetwork } = useSelectedNetwork();
  const [avatar, setAvatar] = useState<string>('');

  const { isOpen, onClose, onOpen } = useDisclosure()




  const getAvatar = (address: string) => {
    if (!address) return '';

    if (localStorage.getItem(`avatar-${address}`) !== null) {
      return localStorage.getItem(`avatar-${address}`);
    }

    const el = createIcon({
      seed: address,
    })

    localStorage.setItem(`avatar-${address}`, el.toDataURL());

    return el.toDataURL();
  }

  useEffect(() => {
    if (account) {
      setAvatar(getAvatar(account));
    }
  }, [account])

  const addNetwork = async (layer: number = 2) => {
    if (!library) {
      console.warn('No library');
      return; // no connected wallet
    }

    const chainIdsMap = {
      l1: selectedNetwork === SelectedNetworkType.Mainnet ? NEVMChain.chainId : TanenbaumChain.chainId,
      l2: selectedNetwork === SelectedNetworkType.Mainnet ? RolluxChainMainnet.chainId : RolluxChain.chainId
    }

    // console.log(chainIdsMap);

    const chainIdToAdd = layer === 1 ? chainIdsMap.l1 : chainIdsMap.l2;
    const chainToAdd = networks[chainIdToAdd] ?? false;

    if (!chainToAdd) {
      console.warn('No chain to add');
      return;
    }

    try {
      await switchNetwork(chainToAdd.chainId);
    } catch (e) {
      console.log(e);
      const provider = library as ethers.providers.JsonRpcProvider;
      const payload = {
        chainId: ethers.utils.hexValue(chainToAdd.chainId),
        chainName: chainToAdd.chainName,
        nativeCurrency: chainToAdd.nativeCurrency,
        rpcUrls: [chainToAdd.rpcUrl],
        blockExplorerUrls: [chainToAdd.blockExplorerUrl]
      };
      await provider.send('wallet_addEthereumChain', [payload as AddEthereumChainParameter, account]);
    }
  }


  return <>
    {!account ? (
      <>
        <Button
          variant="primary"
          px="32.5px"
          onClick={() => {
            if (isOpenConnect) {
              onCloseConnect();
            }

            onOpenConnect();
          }}
          {...rest}
        >
          Connect Wallet
        </Button>

        <ConnectWalletModal isOpen={isOpenConnect} onClose={onCloseConnect} onOpen={onOpenConnect} />
        {/* <RainbowConnectButton /> */}
      </>
    ) : (
      <Button px="32.5px" onClick={onOpen} {...rest}>
        <Avatar size={'xs'} name={account} src={avatar} mr={3} />
        {account.substring(0, 5)}...{account.substring(account.length - 4, account.length)}
        {/* {hasPending && <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='green.500'
          size='xl'
        />} */}
      </Button>
    )}

    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW="521px">
        <ModalCloseButton size="sm" />
        <ModalBody p="24px">
          <VStack
            divider={<StackDivider color={'gray.400'} />}
            spacing={3}
          >
            <Avatar name={account} src={avatar} />

            <Heading size={'md'}>
              {account}
            </Heading>

          </VStack>



          <Box mt={4}>
            <Heading size={'md'}>
              <ChevronRightIcon /> Networks
            </Heading>
            <ButtonGroup variant="outline" w="100%" my="12px" spacing={{ base: '20px', xl: '44px' }} px="24px">
              <Button w="100%" py="12px" h="min" onClick={() => addNetwork(1)}>
                <VStack>
                  <Text bg="brand.primary" borderRadius="full" boxSize="44px" display="flex" alignItems="center" justifyContent="center" fontWeight="bold" fontSize="xl">
                    L1
                  </Text>
                  <Text>Add L1 network</Text>
                </VStack>
              </Button>

              <Button w="100%" py="12px" h="min" onClick={() => addNetwork(2)}>
                <VStack>
                  <Text bg="brand.primary" borderRadius="full" boxSize="44px" display="flex" alignItems="center" justifyContent="center" fontWeight="bold" fontSize="xl">
                    L2
                  </Text>
                  <Text>Add L2 network</Text>
                </VStack>
              </Button>
            </ButtonGroup>
          </Box>

          <Box mt={4} mb={4}>
            <Heading size={'md'} mb={3}>
              <ChevronRightIcon /> History
            </Heading>
            <VStack
              spacing={2}

            >
              <NextLink href={"/"} style={{ width: '100%' }} passHref>
                <Button padding={4} width={'100%'} justifyContent={'flex-start'} isDisabled={true}>
                  <ArrowForwardIcon /> Deposits
                </Button>
              </NextLink>

              <NextLink href={"/"} style={{ width: '100%' }} passHref>
                <Button padding={4} width={'100%'} justifyContent={'flex-start'} isDisabled={true}>
                  <ArrowBackIcon /> Withdrawals
                </Button>
              </NextLink>

            </VStack>
          </Box>

          <Box mt={4} mb={4}>
            <Heading size={'md'} mb={3}>
              <ChevronRightIcon /> Dev Tools
            </Heading>
            <VStack
              spacing={2}
              align={'flex-start'}>
              <NextLink href={"/nft"} style={{ width: '100%' }} passHref>
                <Button padding={4} width={'100%'} justifyContent={'flex-start'}>
                  <ArrowForwardIcon /> NFT Bridge
                </Button>
              </NextLink>
              <NextLink href={"/create-token"} style={{ width: '100%' }} passHref>
                <Button padding={4} width={'100%'} justifyContent={'flex-start'}>
                  <ArrowForwardIcon /> Bridge your token
                </Button>
              </NextLink>

            </VStack>
          </Box>

          {selectedNetwork === SelectedNetworkType.Testnet && <>
            <Box mt={4} mb={4}>
              <Heading size={'md'} mb={3}>
                <ChevronRightIcon /> Testnet
              </Heading>
              <VStack
                spacing={2}
                align={'flex-start'}>

                <Button as={"a"} target={'_blank'} href="https://sysdomains.xyz/rollux-faucet" padding={4} width={'100%'} justifyContent={'flex-start'}>
                  <ArrowForwardIcon /> Get TSYS
                </Button>

              </VStack>
            </Box>
          </>}



          <Button
            colorScheme='black'
            mr={3}
            onClick={() => {
              deactivate()
              onClose()
            }}
            bg="#2F2828" w="100%"
          >
            Disconnect
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  </>
}