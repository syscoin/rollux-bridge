import { ArrowDownIcon } from '@chakra-ui/icons';
import { Flex } from '@chakra-ui/react';
import React, { FC } from 'react'

export const DirectionSwitcherArrow: FC<{ onClick: () => void }> = ({ onClick }) => {
    return (<>
        <Flex mt={1} justifyContent={'center'} alignContent={'center'} flexDirection={'row'}>
            <ArrowDownIcon onClick={onClick} sx={{ cursor: 'pointer', color: 'green.300' }} fontSize={'lg'} />
        </Flex>
    </>);
}