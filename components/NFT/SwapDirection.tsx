import React, { FC, useEffect, useState } from "react";
import NFTSwapDirection from "blockchain/NevmRolluxBridge/enums/NFTSwapDirection"
import { Icon, Flex, Box, Card, CardBody, Heading, Button } from "@chakra-ui/react"
import { MdSwapHoriz, MdOutlineSwapVerticalCircle } from "react-icons/md";

export type SwapDirectionProps = {
    currentDirection: NFTSwapDirection;
    onDirectionChanged: (direction: NFTSwapDirection) => void;
}

const getDirectionLabel = (direction: NFTSwapDirection): string => {
    return direction === NFTSwapDirection.L1_TO_L2 ? 'NEVM' : 'Rollux'
}

export const SwapDirection: FC<SwapDirectionProps> = ({ currentDirection, onDirectionChanged }) => {
    const [oppositeDirection, setOppositeDirection] = useState<NFTSwapDirection>(NFTSwapDirection.L2_TO_L1);

    useEffect(() => {
        setOppositeDirection(
            currentDirection === NFTSwapDirection.L1_TO_L2 ? NFTSwapDirection.L2_TO_L1 : NFTSwapDirection.L1_TO_L2
        )
    }, [currentDirection])

    return (
        <Card w={'100%'}>
            <CardBody>
                <Flex gap={3} justifyContent={'center'}>
                    <Box>
                        <Heading size={'md'}>
                            Swap NFT from {getDirectionLabel(currentDirection)} to {getDirectionLabel(oppositeDirection)}
                        </Heading>
                    </Box>
                    <Box>
                        <Button size={'sm'} onClick={() => onDirectionChanged(oppositeDirection)}>

                            <Icon as={MdSwapHoriz} />
                        </Button>
                    </Box>
                </Flex>
            </CardBody>
        </Card>
    );

}

export default SwapDirection;