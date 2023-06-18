import { Box, Card, FormControl, FormLabel, Input, CardBody, VStack, Skeleton, CardHeader, HStack, Image } from "@chakra-ui/react";
import React, { FC } from "react"

export type PreviewNFTProps = {
    isLoading: boolean,
    image: string,
    title: string,
    tokenId: number
}

export const PreviewNFT: FC<PreviewNFTProps> = ({ isLoading, image, title, tokenId }) => {
    return (<>
        <Card w={'45%'} h={'40vh'}>
            <CardBody>
                <CardHeader h={'25vh'}>
                    <Skeleton isLoaded={isLoading} h={'100%'}>
                        <Image src={image} alt={'NFT'} />
                    </Skeleton>
                </CardHeader>
                <CardBody>
                    <VStack alignItems={'left'} justifyContent={'left'}>
                        <Skeleton isLoaded={isLoading} w={'40%'}>
                            {title}
                        </Skeleton>
                        <Skeleton isLoaded={isLoading} w={'60%'}>
                            # {tokenId}
                        </Skeleton>
                    </VStack>
                </CardBody>
            </CardBody>
        </Card>
    </>)
}


export default PreviewNFT;