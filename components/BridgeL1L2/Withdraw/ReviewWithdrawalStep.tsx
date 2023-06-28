import React, { FC, useState, useEffect } from "react"
import { HStack, Icon, Text, Spacer, Box, Link, IconButton } from "@chakra-ui/react"
import { MdGasMeter, MdLink, MdLocalGasStation } from "react-icons/md"
import { IconType } from "react-icons/lib"


export type ReviewWithdrawalStepProps = {
    icon: IconType,
    title: string,
    gasPrice?: string | number | null,
    externalLink?: string | null,
}

export const ReviewWithdrawalStep: FC<ReviewWithdrawalStepProps> = ({
    icon,
    title,
    gasPrice,
    externalLink,
}) => {


    return (<Box
        sx={{
            // cursor: externalLink ? 'pointer' : 'default',
            p: 4,
            borderRadius: 'md',
            transition: 'all 0.2s',
            mb: 3,
            _hover: {
                bg: 'gray.100',
            },
        }}
    >
        <HStack>
            <Icon as={icon} />
            <Text>{title}</Text>
            {externalLink && <>
                <IconButton size={'sm'} onClick={() => {
                    window.open(externalLink, '_blank')
                }} icon={<Icon as={MdLink} />} aria-label={""} />
            </>}
            {gasPrice && <>
                <Spacer />
                <Text>
                    est: ${gasPrice} <Icon as={MdLocalGasStation} />
                </Text>
            </>}
        </HStack>
    </Box>);

}