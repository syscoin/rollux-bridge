import React, { FC } from "react"
import { IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

export type CloseButtonProps = {
    onClose: () => void;
    setScreen: (value: string) => void;
}

export const CloseButton: FC<CloseButtonProps> = ({ onClose, setScreen }) => {
    return (<>
        <IconButton aria-label="Close" onClick={() => {
            setScreen('connect');
            onClose();
        }} icon={<CloseIcon />} />
    </>);
}

export default CloseButton;