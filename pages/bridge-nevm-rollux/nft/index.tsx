import React from "react"
import { NextPage } from "next"
import { RolluxPageWrapper } from "components/Common/RolluxPageWrapper"
import { SelectedNetworkType } from "blockchain/NevmRolluxBridge/config/networks"
import { useSelectedNetwork } from "hooks/rolluxBridge/useSelectedNetwork"
import InputNFT from "components/NFT/InputNFT"
import { Box, CardBody, Flex, Card, Heading, Button } from "@chakra-ui/react"
import { ArrowRight } from "@mui/icons-material"
import PreviewNFT from "components/NFT/PreviewNFT"
import { useEthers } from "@usedapp/core"
import ConnectedWalletButton from "components/Common/ConnectedWalletButton"

export type NFTPageIndexProps = {

}

export const NFTPageIndex: NextPage<NFTPageIndexProps> = () => {
    const { selectedNetwork } = useSelectedNetwork();
    const { account } = useEthers();
    return (
        <RolluxPageWrapper
            title="Create token for bridge"
            description="Bridge your L1 token to L2 in a few clicks."
            blockerText={selectedNetwork === SelectedNetworkType.Unsupported ?
                'Please select correct network' : null
            }
        >
            <Card mb={3}>
                <Box
                    bgGradient="linear-gradient(90deg, #E0E0E0 4.05%, #DBEF88 95.38%)"
                    boxShadow="xl"
                    borderRadius="md"
                    overflow="hidden"
                >
                    <CardBody justifyContent={'center'} textAlign={'center'}>
                        <Heading size={'lg'}>
                            Rollux NFT Bridge
                        </Heading>
                    </CardBody>
                </Box>
            </Card>
            <Flex direction={'row'} alignItems={'center'} gap={2}>
                <InputNFT />
                <Box w={'10%'} alignItems={'center'} justifyContent={'center'} textAlign={'center'}>
                    <ArrowRight />
                </Box>
                <PreviewNFT />
            </Flex>
            <ConnectedWalletButton>
                <Button>
                    Approve NFT
                </Button>
            </ConnectedWalletButton>
        </RolluxPageWrapper>
    )
}

export default NFTPageIndex;