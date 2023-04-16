import { Button } from "@chakra-ui/react";
import React, { FC } from "react"

export type ApproveNFTProps = {
    approved: boolean,
    onClickApprove: () => void,
    isButtonLoading: boolean,
    children: React.ReactNode
}

export const ApproveNFT: FC<ApproveNFTProps> = ({ approved, onClickApprove, children, isButtonLoading }) => {
    if (approved) {
        return <>{children}</>;
    }

    return (
        <Button
            variant="primary"
            isLoading={isButtonLoading}
            loadingText={'Approving NFT'}
            mt={4}
            px="32.5px"
            w={'100%'}
            onClick={() => onClickApprove()}>
            Approve NFT
        </Button>
    )
};

export default ApproveNFT;