import { MessageStatus } from "@eth-optimism/sdk";
import React, { FC } from "react";
import { Card, CardHeader, CardBody, Flex, Spinner, Heading, Badge, Text } from '@chakra-ui/react'
import CrossChainMessageStatusLabel from "components/BridgeL1L2/CrossChainMessageStatusLabel";

export type PendingMessageProps = {
    status: MessageStatus,
    waitTime: number,
}

export const PendingMessage: FC<PendingMessageProps> = ({ status, waitTime }) => {
    return (
        <Card>
            <CardBody>

                <CardBody>
                    <Flex justify={'center'} align={'center'}>
                        <CardHeader>
                            <Heading size={'l'}>
                                Your transaction is on the way.
                            </Heading>
                        </CardHeader>
                    </Flex>
                    <Flex justify={'center'} align={'center'}>
                        <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='green.500'
                            size='xl'
                        />
                    </Flex>
                    <Flex justify={'center'} align={'center'} marginTop={4}>
                        <Badge>
                            <CrossChainMessageStatusLabel status={status} />
                        </Badge>
                    </Flex>
                    <Flex justify={'center'} align={'center'} marginTop={4}>
                        {waitTime !== 0 && <>
                            <Heading size={'xs'}>
                                Estimated wait time - {waitTime}
                            </Heading>
                        </>}
                    </Flex>
                </CardBody>
            </CardBody>
        </Card >
    );
}