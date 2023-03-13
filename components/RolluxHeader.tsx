import { Button, Flex, Img, useBreakpointValue } from "@chakra-ui/react"
import { ConnectButton } from "./ConnectButton"

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
      
      <ConnectButton bg="linear-gradient(90deg, #E0E0E0 4.05%, #DBEF88 95.38%)" />
    </Flex>
  )
}