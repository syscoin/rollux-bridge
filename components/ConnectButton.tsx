import { Avatar, Button, ButtonGroup, ButtonProps, Flex, List, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, VStack } from "@chakra-ui/react"
import { useConnectedWallet } from "@contexts/ConnectedWallet/useConnectedWallet";
import { useEtherBalance, useEthers } from "@usedapp/core";
import { RolluxChain, TanenbaumChain } from "blockchain/NevmRolluxBridge/config/chainsUseDapp";
import { formatEther } from "ethers/lib/utils";

interface ConnectButtonProps extends ButtonProps { }

export const ConnectButton: React.FC<ConnectButtonProps> = ({ ...rest }) => {
  const connectedWalletCtxt = useConnectedWallet();
  const { account, deactivate, switchNetwork, chainId } = useEthers();
  const balance = useEtherBalance(account, { chainId: chainId });

  const { isOpen, onClose, onOpen } = useDisclosure()
  
  return <>
    {!account ? (
      <Button 
        bgColor="linear-gradient(90.06deg, #DBEF88 -3.26%, #EACF5E 207.26%)" 
        px="32.5px" 
        onClick={() => connectedWalletCtxt.connectNEVM('metamask')} 
        _hover={{
          bg: rest.bg || 'linear-gradient(90.06deg, #DBEF88 -3.26%, #EACF5E 207.26%)'
        }}
        {...rest}
      >
        Connect Wallet
      </Button>
    ) : (
      <Button bg="linear-gradient(90.06deg, #DBEF88 -3.26%, #EACF5E 207.26%)" px="32.5px" onClick={onOpen} _hover={{
        bg: rest.bg || 'linear-gradient(90.06deg, #DBEF88 -3.26%, #EACF5E 207.26%)'
      }} {...rest}>
        {account.substring(0, 5)}...{account.substring(account.length - 4, account.length)}
      </Button>
    )}

    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW="421px">
        <ModalCloseButton size="sm" />
        <ModalBody p="24px">
          <List>
            <ListItem><strong>Current network</strong> {chainId === TanenbaumChain.chainId ? 'L1' : 'L2'}</ListItem>
            <ListItem><strong>Balance</strong> {formatEther(balance ?? '0')} SYS</ListItem>
            <ListItem><strong>Address</strong> {account}</ListItem>
          </List>

          <ButtonGroup variant="outline" w="100%" my="32px" spacing={{ base: '20px', xl: '44px' }} px="24px">
            <Button w="100%" py="12px" h="min" onClick={() => switchNetwork(TanenbaumChain.chainId)}>
              <VStack>
                <Text bg="#DBEF88" borderRadius="full" boxSize="44px" display="flex" alignItems="center" justifyContent="center" fontWeight="bold" fontSize="xl">
                  L1
                </Text>
                <Text>Add L1 network</Text>
              </VStack>
            </Button>

            <Button w="100%" py="12px" h="min" onClick={() => switchNetwork(RolluxChain.chainId)}>
              <VStack>
                <Text bg="#DBEF88" borderRadius="full" boxSize="44px" display="flex" alignItems="center" justifyContent="center" fontWeight="bold" fontSize="xl">
                  L2
                </Text>
                <Text>Add L2 network</Text>
              </VStack>
            </Button>
          </ButtonGroup>

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