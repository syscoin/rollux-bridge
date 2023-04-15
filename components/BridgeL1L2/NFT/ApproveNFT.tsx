import { Button } from "@chakra-ui/react";
import React, { FC } from "react"

export type ApproveNFTProps = {
    allowance: number,
    onClickApprove: () => void,
    children: React.ReactFragment
}

export const ApproveNFT: FC<ApproveNFTProps> = ({ allowance, onClickApprove, children }) => {
    if (allowance >= 1) {
        return <>{children}</>;
    }

    return (
        <Button
            variant="primary"
            mt={4}
            px="32.5px"
            w={'100%'}
            onClick={() => onClickApprove()}>
            Approve NFT
        </Button>
    )
};

export default ApproveNFT;