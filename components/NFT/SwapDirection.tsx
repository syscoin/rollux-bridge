import React, { FC, useState } from "react";
import NFTSwapDirection from "blockchain/NevmRolluxBridge/enums/NFTSwapDirection"
import { Select, Flex, Box, Card, CardBody, Heading } from "@chakra-ui/react"

export type SwapDirectionProps = {
    currentDirection: NFTSwapDirection;
    onDirectionChanged: (direction: NFTSwapDirection) => void;
}

const getDirectionLabel = (direction: NFTSwapDirection): string => {
    return direction === NFTSwapDirection.L1_TO_L2 ? 'NEVM' : 'Rollux'
}

export const SwapDirection: FC<SwapDirectionProps> = ({ currentDirection, onDirectionChanged }) => {
    const [oppositeDirection, setOppositeDirection] = useState<NFTSwapDirection>(NFTSwapDirection.L2_TO_L1);


    return (
        <Card w={'100%'}>
            <CardBody>
                <Flex gap={3} justifyContent={'center'}>
                    <Box>
                        <Heading size={'md'}>
                            Swap NFT from {getDirectionLabel(currentDirection)} to {getDirectionLabel(oppositeDirection)}
                        </Heading>
                    </Box>
                </Flex>
            </CardBody>
        </Card>
    );

}

export default SwapDirection;