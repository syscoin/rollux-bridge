import React, { FC } from "react"
import { VStack, HStack, Text, Box, Image, Heading } from "@chakra-ui/react";

export type ConnectWalletButtonProps = {
    onClick: () => void;
    logoPath: string;
    label: string;

}

const recentsTracker = () => {
    return {
        trackRecent: (value: string) => {
            const recent_wallets = localStorage.getItem('recent_wallets') ?? '[]';

            const recent_wallets_array = JSON.parse(recent_wallets);

            if (recent_wallets_array.includes(value)) {
                return;
            }

            recent_wallets_array.push(value);

            localStorage.setItem('recent_wallets', JSON.stringify(recent_wallets_array));
        },
        isRecent: (value: string) => {
            const recent_wallets = localStorage.getItem('recent_wallets') ?? '[]';

            const recent_wallets_array = JSON.parse(recent_wallets);

            if (recent_wallets_array.includes(value)) {
                return true;
            }
            return false;
        }

    }
}

export const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({ onClick, logoPath, label }) => {
    return (<>
        <Box w={'100%'} onClick={() => {
            recentsTracker().trackRecent(label);
            onClick();
        }} as={'button'} sx={{
            '&:hover': {
                cursor: 'pointer',
                transform: 'scale(1.02) translate(0px, -2px) !important',
                boxShadow: '0 0 0 1px #68D391, 0 0 0 1px #68D391',
            },
            backgroundColor: 'gray.100',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            padding: '8px',
        }}>
            <HStack>
                <Image src={logoPath} alt={label} boxSize="24px" h={'40px'} w={'40px'} />
                <VStack spacing={2}>
                    <Heading size={'sm'}>{label}</Heading>
                    {recentsTracker().isRecent(label) && <Text w={'100%'} textAlign={'left'} color={'green.500'}>Recent</Text>}
                </VStack>

            </HStack>
        </Box>
    </>);
}