import React, { FC, useEffect, useState } from "react"
import {
    useDisclosure,
    Modal,
    ModalContent,
    ModalOverlay,
    ModalHeader,
    ModalBody,
    Box,
    Text,
    Button,
    HStack,
    Spacer,
    Icon,
    Divider
} from "@chakra-ui/react";
import { MdWarning, MdKey, MdRoute, MdAddRoad, MdCrisisAlert } from "react-icons/md";
import { RolluxLogo } from "components/Icons/RolluxLogo";


export type WelcomeDisclaimerProps = {

}

export const WelcomeDisclaimer: FC<WelcomeDisclaimerProps> = ({ }) => {
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const getAcceptedTerms = () => {
        return localStorage.getItem('accepted_terms');
    }


    useEffect(() => {
        const termsAccepted = getAcceptedTerms();
        console.log(termsAccepted);
        if (termsAccepted) {
            setAcceptedTerms(true);
            onClose();
        } else {
            onOpen();
        }

        window.addEventListener('storage', (e) => {
            if (e.key === 'accepted_terms') {
                setAcceptedTerms(true);
                onClose();
            }
        }
        );

        return () => {
            window.removeEventListener('storage', () => { });
        }
    }, [onClose, onOpen]);

    return (<>
        <Modal size={'lg'} isOpen={isOpen} onClose={() => { }}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <HStack>
                        <RolluxLogo height={30} />
                        <Text fontStyle={'italic'}>Welcome to Rollux Bridge</Text>
                    </HStack>
                </ModalHeader>
                <Divider />
                <ModalBody>
                    <Box mb={1}>
                        <HStack p={2}>
                            <Icon as={MdKey} sx={{ color: 'red.500', boxSize: 10, padding: '5px' }} />
                            <Text color={'brand.secondary'}>We will never ask for your private keys or seed phrase.</Text>
                        </HStack>
                    </Box>
                    <Box mb={1}>
                        <HStack p={2}>
                            <Icon as={MdCrisisAlert} sx={{ color: 'red.500', boxSize: 10, padding: '5px' }} />
                            <Text>
                                <Text color={'brand.secondary'}>This is a beta version of the bridge. </Text>
                                <Text>For guidance refer to our
                                    <Text as={'a'} href={'https://sys-labs.github.io/community-hub'} textDecoration={'underline'} fontWeight={700} target={'_blank'} color={'brand.secondary'}> documentation</Text> or
                                    <Text as={'a'} href={'https://sys-labs.github.io/community-hub/docs/security-model'} textDecoration={'underline'} fontWeight={700} target={'_blank'} color={'brand.secondary'}> security model</Text>.
                                </Text>
                            </Text>
                        </HStack>
                    </Box>
                    <Box mb={1}>
                        <HStack p={2}>
                            <Text>
                                By clicking the button below, you agree to our
                                <Text as={'a'} href={'https://sys-labs.github.io/community-hub/docs/terms-and-conditions'} textDecoration={'underline'} fontWeight={700} target={'_blank'} color={'brand.secondary'}> Terms and Conditions</Text>.
                            </Text>
                        </HStack>
                    </Box>

                    <HStack mb={2} mt={3}>

                        <Button w={'100%'}
                            variant={'secondary'}
                            onClick={() => {
                                localStorage.setItem('accepted_terms', 'true');
                                setAcceptedTerms(true);
                                onClose();
                            }}>Agree to terms</Button>
                    </HStack>
                </ModalBody>

            </ModalContent>
        </Modal>

    </>);
}