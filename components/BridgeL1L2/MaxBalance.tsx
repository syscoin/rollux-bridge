import React, { FC } from "react"
import { Text } from "@chakra-ui/react";

export const MaxBalance: FC<{ onClick: () => void }> = ({ onClick }) => {
    return (<>
        <Text size={'xs'} onClick={onClick} sx={{ cursor: 'pointer' }} color="brand.secondary">( Max )</Text>
    </>);
}