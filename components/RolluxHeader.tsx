import { Box, Button, Flex, HStack, Img, IconButton, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { HamburgerIcon } from '@chakra-ui/icons';
import { ConnectButton } from "./ConnectButton";
import NetworkSwitcher from "./HeaderElements/NetworkSwitcher";
import NextLink from "next/link"
import { useEthers } from "@usedapp/core";

export const RolluxHeader: React.FC = () => {
  const { account } = useEthers();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const src = useBreakpointValue({
    base: '/rollux-portal-logo-white.svg',
    xl: '/rollux-portal-logo.svg'
  });
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      gap={{ base: '16px', lg: '60px', sm: '10px', xs: '10px' }}
      w="100%"
      justifyContent="center"
      p="4"
      flexWrap="nowrap"
      bg={{ base: '#28282F', xl: 'transparent' }}
    >
      {isSmallScreen ? (
        <>
          <HStack spacing={4}>
            <Img src={src} />
            <IconButton aria-label="OpenMenu" icon={<HamburgerIcon />} onClick={onOpen} />
          </HStack>
          {isOpen && (
            <>
              <Box position="fixed" w="100vw" h="100vh" top="0" left="0" right="0" bottom="0" onClick={onClose} bg="rgba(0, 0, 0, 0.4)" zIndex={9} />
              <Flex direction="column" bg="#28282F" position="fixed" right={0} top={0} width="80vw" height="100vh" zIndex={10} p={4} boxShadow="xl">
                <Img mb={3} src={src} />

                <NextLink href={"/bridge-nevm-rollux/"} passHref>
                  <Button variant={'primary'} width={'100%'} mb={3} onClick={onClose}>Tokens</Button>
                </NextLink>
                <NextLink href={"/bridge-nevm-rollux/nft"} passHref>
                  <Button variant={'primary'} width={'100%'} mb={3} onClick={onClose}>NFT</Button>
                </NextLink>

                <ConnectButton mb={3} variant="secondary" />
                {account && <NetworkSwitcher />}

              </Flex>
            </>
          )}
        </>
      ) : (
        <HStack spacing={4}>
          <Img src={src} />
          <NextLink href={"/bridge-nevm-rollux/"} passHref>
            <Button variant={'primary'} >
              Tokens
            </Button>
          </NextLink>
          <NextLink href={"/bridge-nevm-rollux/nft"} passHref>
            <Button variant={'primary'}>
              NFT
            </Button>
          </NextLink>
          <ConnectButton variant="secondary" />
          {account && <NetworkSwitcher />}
        </HStack>
      )}
    </Flex>
  )
}
