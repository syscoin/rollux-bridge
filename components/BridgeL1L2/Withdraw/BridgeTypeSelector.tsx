import { SunIcon } from "@chakra-ui/icons";
import { Box, HStack, Radio, Text, Spacer, Checkbox, CheckboxIcon, Icon, VStack } from "@chakra-ui/react";
import React, { FC } from "react"
import { MdCheckCircle, MdCircle } from "react-icons/md";

export type BridgeTypeSelectorProps = {
    onSelected: () => void;
    icon: React.ReactNode;
    label: string;
    description: React.ReactNode;
    defaultChecked?: boolean;
}

export const BridgeTypeSelector: FC<BridgeTypeSelectorProps> = ({ onSelected, icon, label, description, defaultChecked }) => {
    return (<>
        <Box onClick={() => {
            onSelected();
        }} sx={
            {
                '&:hover': {
                    cursor: 'pointer',
                    transform: 'scale(1.02) translate(0px, -2px) !important',
                    boxShadow: '0 0 0 1px #68D391, 0 0 0 1px #68D391',
                },
                '&:active': {
                    transform: 'scale(1.02) translate(0px, -2px) !important',
                    boxShadow: '0 0 0 1px #68D391, 0 0 0 1px #68D391',
                },
                backgroundColor: 'white.300',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                padding: 3,
                marginBottom: '10px',
                width: '100%',
                boxShadow: defaultChecked ? '0 0 0 1px #68D391, 0 0 0 1px #68D391' : undefined,
            }
        }>

            <HStack spacing={3} mb={3} mt={1}>
                {icon}
                <Text fontWeight={'extrabold'}>
                    {label}
                </Text>
                <Spacer />
                {defaultChecked &&
                    <Icon as={MdCheckCircle} color={'green.500'} />
                }
                {!defaultChecked &&
                    <Icon as={MdCircle} color={'gray.300'} />
                }
            </HStack>
            <VStack mt={2} gap={0} textAlign={'left'} alignItems={'flex-start'}>
                {description}
            </VStack>

        </Box>
    </>);
}