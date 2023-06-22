import { SunIcon } from "@chakra-ui/icons";
import { Box, HStack, Radio, Text, Spacer, Checkbox, CheckboxIcon, Icon } from "@chakra-ui/react";
import React, { FC } from "react"
import { MdCheckCircle } from "react-icons/md";

export type BridgeTypeSelectorProps = {
    onSelected: () => void;
    icon: React.ReactNode;
    label: string;
    description: string;
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
                padding: '12px',
                marginBottom: '10px',
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
            </HStack>
            <Text fontSize={'sm'}>
                {description}
            </Text>
        </Box>
    </>);
}