import { Box, Card, FormControl, FormLabel, Input, CardBody, NumberInput, NumberInputField } from "@chakra-ui/react";
import React, { FC } from "react"

export type InputNFTProps = {
    onChangeContractAddress: (address: string) => void;
    onChangeTokenId: (tokenId: number) => void;
    contractAddressValue?: string | undefined,
    tokenIdValue?: number | undefined
}

export const InputNFT: FC<InputNFTProps> = ({ onChangeContractAddress, onChangeTokenId, contractAddressValue, tokenIdValue }) => {
    return (<>
        <Card w={'45%'}>
            <CardBody>
                <FormControl>
                    <FormLabel>
                        Contract Address
                    </FormLabel>
                    <Input value={contractAddressValue ?? ''} type={'text'} onChange={(e) => onChangeContractAddress(e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel>
                        Token ID
                    </FormLabel>
                    <NumberInput value={tokenIdValue ?? ''} onChange={(value) => onChangeTokenId(Number(value))}>
                        <NumberInputField placeholder='1394' />
                    </NumberInput>
                </FormControl>
            </CardBody>
        </Card>
    </>)
}


export default InputNFT;