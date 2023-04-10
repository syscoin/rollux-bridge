import { Box, Card, FormControl, FormLabel, Input, CardBody, VStack, Skeleton, CardHeader, HStack } from "@chakra-ui/react";
import React, { FC } from "react"

export type PreviewNFTProps = {

}

export const PreviewNFT: FC<PreviewNFTProps> = () => {
    return (<>
        <Card w={'45%'} h={'40vh'}>
            <CardBody>
                <CardHeader h={'25vh'}>
                    <Skeleton isLoaded={false} h={'100%'}>
                        Image
                    </Skeleton>
                </CardHeader>
                <CardBody>
                    <VStack alignItems={'left'} justifyContent={'left'}>
                        <Skeleton isLoaded={false} w={'40%'}>
                            Collection Name
                        </Skeleton>
                        <Skeleton isLoaded={false} w={'60%'}>
                            Token ID
                        </Skeleton>
                    </VStack>
                </CardBody>
            </CardBody>
        </Card>
    </>)
}


export default PreviewNFT;