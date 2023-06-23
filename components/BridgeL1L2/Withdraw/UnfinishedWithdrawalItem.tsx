import { Alert, AlertIcon, Badge, Box, HStack, Text, Icon, Spacer, useClipboard, useToast } from "@chakra-ui/react";
import { MessageStatus } from "@eth-optimism/sdk";
import React, { FC } from "react";
import CrossChainMessageStatusLabel from "../CrossChainMessageStatusLabel";
import { shortenTransactionHash } from "@usedapp/core";
import { Button } from "@chakra-ui/react";
import { MdArrowForward, MdArrowRight, MdOpenInFull, MdRemoveRedEye, MdViewInAr, MdViewList } from "react-icons/md";

export type UnfinishedWithdrawalItemProps = {
    status: MessageStatus,
    txHash: string,
    onClickView: () => void;
}
// <Alert status="warning" sx={{ marginBottom: 3 }}>
//     <AlertIcon />
//     <Badge padding={3}>{shortenTransactionHash(txHash)}</Badge><Button onClick={() => {
//         onClickView();
//     }} variant="primary" width={'100%'} marginLeft="5">View</Button>
// </Alert>


export const UnfinishedWithdrawalItem: FC<UnfinishedWithdrawalItemProps> = ({ status, txHash, onClickView }) => {
    const { onCopy, hasCopied } = useClipboard(txHash);
    const toast = useToast();

    return (
        <>
            <Box sx={{
                marginBottom: 3,
                padding: 3,
                borderRadius: 'md',
                border: '1px solid',
                borderColor: 'gray.400',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                '&:hover': {
                    cursor: 'pointer',
                    borderColor: 'gray.300',
                    boxShadow: '0 0 0 1px #E2E8F0',
                }
            }}
            >
                <HStack width={'100%'}>
                    <Icon as={MdArrowForward} sx={{ color: 'green.400', boxSize: 8 }} />
                    <Text fontWeight={700} >
                        <CrossChainMessageStatusLabel status={status} />
                    </Text>
                    <Spacer />
                    <Button onClick={() => {
                        onClickView();
                    }
                    } variant="primary" marginLeft="5">
                        <Icon as={MdRemoveRedEye} sx={{ color: 'black', boxSize: 5 }} />
                    </Button>
                    <Badge onClick={() => {
                        onCopy();
                        toast({
                            title: "Copied to clipboard",
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                        })
                    }} padding={3} backgroundColor={hasCopied ? 'green.300' : 'gray.200'}>{shortenTransactionHash(txHash)}</Badge>
                </HStack>
            </Box>
        </>
    )
}

export default UnfinishedWithdrawalItem;