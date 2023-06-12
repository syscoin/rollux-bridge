import { ArrowDownIcon } from '@chakra-ui/icons';
import { Flex } from '@chakra-ui/react';
import React, { FC } from 'react'

export const DirectionSwitcherArrow: FC<{ onClick: () => void }> = ({ onClick }) => {
    return (<>
        <Flex mt={4} justifyContent={'center'} alignContent={'center'} flexDirection={'row'}>
            <ArrowDownIcon onClick={onClick} sx={{ cursor: 'pointer' }} color="brand.secondaryGradient" fontSize={'lg'} />
        </Flex>
    </>);
}