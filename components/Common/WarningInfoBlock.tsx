import React, { FC } from "react";
import { Flex, HStack, Text } from "@chakra-ui/react";
import exp from "constants";

export type WarningInfoBlockProps = {
    children: React.ReactNode;
    warningText: string;
}

export const WarningInfoBlock: FC<WarningInfoBlockProps> = ({ children, warningText }) => {
    return (
        <>
            <Flex bg="brand.primary" px="28px" py="14px" w="100%" boxShadow="0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)" borderRadius="12px">
                <Text fontSize="14px">{warningText}</Text>
            </Flex>
            <Flex mb={4} mt={4} justifyContent={'center'}>
                {children}
            </Flex>
        </>


    );
}

export default WarningInfoBlock;