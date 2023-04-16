import React, { useEffect, useMemo, useState } from "react"
import { NextPage } from "next"
import { RolluxPageWrapper } from "components/Common/RolluxPageWrapper"
import { SelectedNetworkType } from "blockchain/NevmRolluxBridge/config/networks"
import { useSelectedNetwork } from "hooks/rolluxBridge/useSelectedNetwork"
import InputNFT from "components/NFT/InputNFT"
import { Box, CardBody, Flex, Card, Heading, Button } from "@chakra-ui/react"
import { ArrowRight } from "@mui/icons-material"
import PreviewNFT from "components/NFT/PreviewNFT"
import { CallResult, useCall, useContractFunction, useEthers } from "@usedapp/core"
import ConnectedWalletButton from "components/Common/ConnectedWalletButton"
import { ApproveNFT } from "components/BridgeL1L2/NFT/ApproveNFT"
import { ethers } from "ethers"
import ERC721Abi from "blockchain/NevmRolluxBridge/abi/ERC721"
import NFTSwapDirection from "blockchain/NevmRolluxBridge/enums/NFTSwapDirection"
import SwapDirection from "components/NFT/SwapDirection"

export type NFTPageIndexProps = {

}



export const NFTPageIndex: NextPage<NFTPageIndexProps> = () => {
    const { selectedNetwork, contractsL1, contractsL2, l1ChainId, l2ChainId } = useSelectedNetwork();
    const { account, switchNetwork } = useEthers();

    const [nftAddress, setNftAddress] = useState<string>('');
    const [tokenId, setTokenId] = useState<number | undefined>(undefined);

    const [direction, setDirection] = useState<NFTSwapDirection>(NFTSwapDirection.L1_TO_L2);
    const [isApproved, setIsApproved] = useState<boolean>(false);

    const bridgeContractAddress: string | undefined = useMemo(() => {
        if (direction === NFTSwapDirection.L1_TO_L2) {
            // if direction from l1 to l2 we'll use l1 bridge

            return contractsL1.L1ERC721Bridge;
        }

        if (direction === NFTSwapDirection.L2_TO_L1) {
            // if l2
            return contractsL2.L2ERC721Bridge;
        }

        return undefined;
    }, [direction, contractsL1, contractsL2]);


    const { send: sendApproval, state: approvalTxState } = useContractFunction(
        (nftAddress && tokenId !== undefined ? new ethers.Contract(
            nftAddress,
            new ethers.utils.Interface(ERC721Abi)
        ) : undefined),
        'approve'
    );

    const { value: approvedData, error: approvedError } = useCall(
        (nftAddress && tokenId !== undefined) && {
            contract: new ethers.Contract(
                nftAddress,
                new ethers.utils.Interface(ERC721Abi)
            ),
            method: 'getApproved',
            args: [tokenId]
        }
    ) ?? {}

    useEffect(() => {
        if (!approvedError && bridgeContractAddress) {
            if (approvedData?.operator === bridgeContractAddress) {
                setIsApproved(true)
            } else {
                setIsApproved(false);
            }
        }
    }, [approvedData, approvedError, bridgeContractAddress])

    const handleApproval = async () => {

        if (!bridgeContractAddress || undefined === tokenId) {
            return; // do nothing , prevent using unitialized function
        }

        const requiredChainId: number = direction === NFTSwapDirection.L1_TO_L2 ?
            l1ChainId : l2ChainId;

        await switchNetwork(requiredChainId);

        await sendApproval(bridgeContractAddress, tokenId);

    }


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

            <Flex alignItems={'center'} justifyContent={'center'} mb={3} mt={3}>
                <SwapDirection currentDirection={direction}
                    onDirectionChanged={(direction) => setDirection(direction)}
                />
            </Flex>
            <Flex direction={'row'} alignItems={'center'} gap={2}>
                <InputNFT
                    onChangeContractAddress={(address) => setNftAddress(address)}
                    onChangeTokenId={(tokenId) => setTokenId(tokenId.toString().length > 0 ? tokenId : undefined)}
                />
                <Box w={'10%'} alignItems={'center'} justifyContent={'center'} textAlign={'center'}>
                    <ArrowRight />
                </Box>
                <PreviewNFT />
            </Flex>
            <ConnectedWalletButton>
                <ApproveNFT
                    isButtonLoading={['Mining', 'PendingSignature', 'CollectingSignaturePool'].includes(approvalTxState.status)}
                    approved={isApproved}
                    onClickApprove={() => {
                        handleApproval()
                    }}
                >
                    Approved
                </ApproveNFT>
            </ConnectedWalletButton>
        </RolluxPageWrapper>
    )
}

export default NFTPageIndex;