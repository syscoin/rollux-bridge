import React, { FC } from "react"
import {
    Button,
    HStack,
    Text,
    Icon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    Checkbox,
    useDisclosure,
    ModalHeader,
    Spacer,
} from "@chakra-ui/react"
import {
    useSteps,
    Stepper,
    Step,
    StepIndicator,
    StepStatus,
    StepTitle,
    StepDescription
} from '@chakra-ui/stepper'

export type ReviewWithdrawalProps = {
    onClickWithdrawal: () => void;
    onClickUseThirdPartyBridge: () => void;
    isDisabled: boolean;
    amountToWithdraw: string;
    tokenSymbol: string;
    totalEstimatedFeeUsd: string | number;
    initiateFeeUsd: string | number;
    proveFeeUsd: string | number;
    claimFeeUsd: string | number;
}


export const ReviewWithdrawal: FC<ReviewWithdrawalProps> = ({
    onClickWithdrawal,
    onClickUseThirdPartyBridge,
    isDisabled,
    amountToWithdraw,
    tokenSymbol,
    totalEstimatedFeeUsd,
    initiateFeeUsd,
    proveFeeUsd,
    claimFeeUsd
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (<>
        <Button variant={'secondary'}
            isDisabled={isDisabled}
            onClick={() => {
                onOpen()
            }}>
            Review widthdraw
        </Button>

        <Modal size={'lg'} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>

                <ModalHeader>
                    Withdrawal
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <HStack mb={1} mt={1}>
                        <Text color={'gray.400'}>Amount to withdraw</Text>
                    </HStack>
                    <HStack mb={1} mt={1}>
                        <Text fontSize={'xl'} fontWeight={'bold'}>{amountToWithdraw} {tokenSymbol}</Text>
                        <Spacer />
                        <Text fontSize={'xl'} color={'gray.400'}>${totalEstimatedFeeUsd}</Text>
                    </HStack>
                </ModalBody>
            </ModalContent>
        </Modal>

    </>)
}