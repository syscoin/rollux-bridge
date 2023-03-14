import { Flex, Text } from "@chakra-ui/react"

export const ConnectionWarning: React.FC = () => {
  return (
    <Flex bg="brand.primary" px="28px" py="14px" w="100%" boxShadow="0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)" borderRadius="12px">
      <Text fontSize="14px">Before using this interface, you need to connect your wallet.</Text>
    </Flex>
  )
}