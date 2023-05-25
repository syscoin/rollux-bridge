import React, { useCallback, useEffect, useMemo, useState } from "react"
import { NextPage } from "next"
import { RolluxPageWrapper } from "components/Common/RolluxPageWrapper"
import { SelectedNetworkType } from "blockchain/NevmRolluxBridge/config/networks"
import { useSelectedNetwork } from "hooks/rolluxBridge/useSelectedNetwork"
import InputNFT from "components/NFT/InputNFT"
import { Box, CardBody, Flex, Card, Heading, Button, Alert, AlertDescription, AlertDialog, AlertIcon } from "@chakra-ui/react"
import { ArrowRight } from "@mui/icons-material"
import PreviewNFT from "components/NFT/PreviewNFT"
import { CallResult, useCall, useContractFunction, useEthers } from "@usedapp/core"
import ConnectedWalletButton from "components/Common/ConnectedWalletButton"
import { ApproveNFT } from "components/BridgeL1L2/NFT/ApproveNFT"
import { ethers } from "ethers"
import ERC721Abi from "blockchain/NevmRolluxBridge/abi/ERC721"
import NFTSwapDirection from "blockchain/NevmRolluxBridge/enums/NFTSwapDirection"
import SwapDirection from "components/NFT/SwapDirection"
import L1ERC721Bridge from "blockchain/NevmRolluxBridge/abi/L1ERC721Bridge"
import L2ERC721BridgeABI from "blockchain/NevmRolluxBridge/abi/L2ERC721Bridge"
import useFetchNFTMetadata from "hooks/rolluxBridge/useFetchNFTMetadata"
import { useComputeNFTImageUrl } from "hooks/rolluxBridge/useComputeNFTImageUrl"
import { useNFTTokenlist } from "hooks/rolluxBridge/useNFTTokenlist"
import { useCrossChainMessenger } from "hooks/rolluxBridge/useCrossChainMessenger"
import { MessageDirection, MessageStatus } from "@eth-optimism/sdk"
import ManageWithdrawals from "components/NFT/ManageWithdrawals"

export type NFTPageIndexProps = {

}



export const NFTPageIndex: NextPage<NFTPageIndexProps> = () => {
    const { selectedNetwork, contractsL1, contractsL2, l1ChainId, l2ChainId, rpcL1, rpcL2 } = useSelectedNetwork();
    const { switchNetwork, chainId, account } = useEthers();

    const [nftAddress, setNftAddress] = useState<string>('');
    const [tokenId, setTokenId] = useState<number | undefined>(undefined);

    const [direction, setDirection] = useState<NFTSwapDirection>(NFTSwapDirection.L1_TO_L2);
    const [isApproved, setIsApproved] = useState<boolean>(false);

    const [withdraws, setWithdraws] = useState<{
        status: MessageStatus,
        txHash: string
    }[]>([]);

    const [pendingWithdraws, setPendingWithdraws] = useState<{
        status: MessageStatus,
        txHash: string
    }[]>([]);

    const { oppositeLayerToken } = useNFTTokenlist({
        queryToken: nftAddress,
        atChainId: direction === NFTSwapDirection.L1_TO_L2 ? l1ChainId : l2ChainId
    });

    const messenger = useCrossChainMessenger();


    const { value: tokenUriData, error: tokenUriDataError } = useCall(
        (nftAddress && tokenId !== undefined && ethers.utils.isAddress(nftAddress)) && {
            contract: new ethers.Contract(
                nftAddress,
                new ethers.utils.Interface(ERC721Abi)
            ),
            method: 'tokenURI',
            args: [tokenId]
        }
    ) ?? {}

    const nftMetadata = useFetchNFTMetadata({ url: tokenUriData ? tokenUriData[0] : null });
    const nftImageUrl = useComputeNFTImageUrl({ url: nftMetadata?.image ?? null })

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
        ((nftAddress && ethers.utils.isAddress(nftAddress)) && tokenId !== undefined ? new ethers.Contract(
            nftAddress,
            new ethers.utils.Interface(ERC721Abi)
        ) : undefined),
        'approve'
    ) ?? {};

    const { send: sendDepositNFTL1, state: statusDepositNFTL1 } = useContractFunction(
        ((nftAddress && ethers.utils.isAddress(nftAddress)) && tokenId !== undefined && bridgeContractAddress !== undefined ?
            new ethers.Contract(
                bridgeContractAddress,
                new ethers.utils.Interface(L1ERC721Bridge)
            ) : undefined),
        "bridgeERC721"
    )

    const { value: approvedData, error: approvedError } = useCall(
        (nftAddress && tokenId !== undefined && ethers.utils.isAddress(nftAddress)) && {
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
    const handleSendNFT = async () => {
        //direction === NFTSwapDirection.L1_TO_L2
        if (true
            && nftAddress
            && oppositeLayerToken
            && messenger
            && account
        ) {

            sendDepositNFTL1(
                nftAddress,
                oppositeLayerToken.bridgedTo,
                tokenId,
                1_200_000,
                ethers.utils.hexlify(ethers.utils.toUtf8Bytes("rollux-bridge"))
            )
        }
    }




    const widthdrawalsLogs = useCallback(async () => {
        if (direction === NFTSwapDirection.L2_TO_L1 && account && messenger) {
            // check for withdrawals

            const L2BridgeContract = bridgeContractAddress ? new ethers.Contract(
                bridgeContractAddress,
                new ethers.utils.Interface(L1ERC721Bridge),
                new ethers.providers.StaticJsonRpcProvider(rpcL2)
            ) : undefined;

            if (!L2BridgeContract) return [];


            const filter = L2BridgeContract.filters['ERC721BridgeInitiated'](null, null, account)

            const events = await L2BridgeContract.queryFilter(filter);

            if (events.length > 0) {
                const checks = await Promise.all(events.map(async (value) => {
                    const status = await messenger.getMessageStatus(value.transactionHash)

                    return { status: status, txHash: value.transactionHash };
                }))
                return checks;
            }

            return [];


        }
    }, [direction, account, messenger, bridgeContractAddress, rpcL2])

    useEffect(() => {
        if (direction === NFTSwapDirection.L2_TO_L1) {
            widthdrawalsLogs().then(logs => {
                if (!logs) return;

                setWithdraws([...logs]);

                setPendingWithdraws(logs.filter((value) => {
                    if ([MessageStatus.IN_CHALLENGE_PERIOD, MessageStatus.READY_FOR_RELAY, MessageStatus.READY_TO_PROVE].includes(value.status)) {
                        return true;
                    }
                    return false;
                }))
            });
        }
    }, [direction, widthdrawalsLogs])


    const handleSwitchDirection = (direction: NFTSwapDirection) => {
        setDirection(direction)
        setWithdraws([]);
        setPendingWithdraws([]);
        setTokenId(undefined);
        setNftAddress('');
    }


    const handleProveMessage = async (txId: string) => {
        if (!messenger) return;
        try {
            await messenger.proveMessage(txId);
        } catch (e) {
            console.log(e);
        }
    }

    const handleFinalizeMessage = async (txId: string) => {
        if (!messenger) return;
        try {
            await messenger.finalizeMessage(txId);
        } catch (e) {
            console.log(e);
        }
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
                    onDirectionChanged={handleSwitchDirection}
                />
            </Flex>
            {(nftAddress.length > 0 && ethers.utils.isAddress(nftAddress) && oppositeLayerToken === undefined) && <>
                <Alert status="error">
                    <AlertDescription>
                        Given token not found in token list.
                    </AlertDescription>
                </Alert>
            </>}

            {(nftAddress.length > 1 && !ethers.utils.isAddress(nftAddress)) && <>
                <Alert status="warning">
                    <AlertDescription>
                        Invalid NFT contract address.
                    </AlertDescription>
                </Alert>
            </>}

            <ManageWithdrawals
                pendingWithdrawals={pendingWithdraws}
                onClickFinalizeMessage={handleFinalizeMessage}
                onClickProveMessage={handleProveMessage}
            />

            <Flex direction={'row'} alignItems={'center'} gap={2}>
                <InputNFT
                    contractAddressValue={nftAddress}
                    tokenIdValue={tokenId}
                    onChangeContractAddress={(address) => setNftAddress(address)}
                    onChangeTokenId={(tokenId) => setTokenId(tokenId.toString().length > 0 ? tokenId : undefined)}
                />
                <Box w={'10%'} alignItems={'center'} justifyContent={'center'} textAlign={'center'}>
                    <ArrowRight />
                </Box>
                <PreviewNFT
                    isLoading={(nftAddress && nftMetadata && nftImageUrl) ? true : false}
                    title={nftMetadata?.name ?? ''}
                    image={nftImageUrl}
                    tokenId={tokenId ?? 0}
                />
            </Flex>
            <ConnectedWalletButton>
                <ApproveNFT
                    isButtonLoading={['Mining', 'PendingSignature', 'CollectingSignaturePool'].includes(approvalTxState.status)}
                    approved={isApproved}
                    onClickApprove={() => {
                        handleApproval()
                    }}
                >
                    <Button
                        variant="primary"
                        mt={4}
                        px="32.5px"
                        w={'100%'}
                        isLoading={['Mining', 'PendingSignature', 'CollectingSignaturePool'].includes(statusDepositNFTL1.status)}
                        onClick={() => {
                            handleSendNFT()
                        }}
                    >
                        Send NFT
                    </Button>
                </ApproveNFT>
            </ConnectedWalletButton>
        </RolluxPageWrapper >
    )
}

export default NFTPageIndex;