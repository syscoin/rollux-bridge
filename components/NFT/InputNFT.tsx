import { Box, Card, FormControl, FormLabel, Input, CardBody, NumberInput, NumberInputField } from "@chakra-ui/react";
import React, { FC } from "react"

export type InputNFTProps = {
    onChangeContractAddress: (address: string) => void;
    onChangeTokenId: (tokenId: number) => void;
}

export const InputNFT: FC<InputNFTProps> = ({ onChangeContractAddress, onChangeTokenId }) => {
    return (<>
        <Card w={'45%'}>
            <CardBody>
                <FormControl>
                    <FormLabel>
                        Contract Address
                    </FormLabel>
                    <Input type={'text'} onChange={(e) => onChangeContractAddress(e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel>
                        Token ID
                    </FormLabel>
                    <NumberInput onChange={(value) => onChangeTokenId(Number(value))}>
                        <NumberInputField placeholder='1394' />
                    </NumberInput>
                </FormControl>
            </CardBody>
        </Card>
    </>)
}


export default InputNFT;