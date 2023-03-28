import { Button, Flex, Img, useBreakpointValue } from "@chakra-ui/react"
import { ConnectButton } from "./ConnectButton"
import NetworkSwitcher from "./HeaderElements/NetworkSwitcher"

export const RolluxHeader: React.FC = () => {
  const src = useBreakpointValue({
    base: '/rollux-portal-logo-white.svg',
    xl: '/rollux-portal-logo.svg'
  })

  return (
    <Flex
      gap={{ base: '16px', lg: '60px' }}
      w="100%"
      justifyContent="center"
      p="4"
      flexWrap="nowrap"
      bg={{ base: '#28282F', xl: 'transparent' }}
    >
      <Img src={src} />

      <ConnectButton variant="secondary" />
      <NetworkSwitcher />
    </Flex>
  )
}