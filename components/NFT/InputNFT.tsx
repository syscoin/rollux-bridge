import { Box, Card, FormControl, FormLabel, Input, CardBody, VStack } from "@chakra-ui/react";
import { FormControlLabel } from "@mui/material";
import React, { FC } from "react"

export type InputNFTProps = {

}

export const InputNFT: FC<InputNFTProps> = () => {
    return (<>
        <Card w={'45%'}>
            <CardBody>
                <FormControl>
                    <FormLabel>
                        Contract Address
                    </FormLabel>
                    <Input type={'text'} />
                </FormControl>
                <FormControl>
                    <FormLabel>
                        Token ID
                    </FormLabel>
                    <Input type={'text'} />
                </FormControl>
            </CardBody>
        </Card>
    </>)
}


export default InputNFT;