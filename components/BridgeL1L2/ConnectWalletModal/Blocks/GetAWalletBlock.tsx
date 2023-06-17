import React, { FC } from "react"
import {
    ModalHeader,
    HStack,
    Divider,
    IconButton,
    Spacer,
    Text,
    ModalBody,
    Button,
    VStack,
    ModalCloseButton,
    Box,
    Heading,

} from "@chakra-ui/react"

import {
    QuestionIcon,
    CloseIcon,
    ArrowBackIcon,
    LockIcon
} from "@chakra-ui/icons"
import CloseButton from "../CloseButton";
import BackButton from "../BackButton";

export type GetAWalletBlockProps = {
    setScreen: (value: string) => void;
    onClose: () => void;
}


export const GetAWalletBlock: FC<GetAWalletBlockProps> = ({ setScreen, onClose }) => {
    return (<>
        <ModalHeader>
            <HStack spacing={4}>
                <BackButton setScreen={setScreen} screen={'help'} />
                <Spacer />
                <Text textAlign={'center'}>Get a Wallet</Text>
                <Spacer />
                <CloseButton onClose={onClose} setScreen={setScreen} />
            </HStack>
        </ModalHeader>
        <Divider />
        <ModalBody>
        </ModalBody>

    </>);

}