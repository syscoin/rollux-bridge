import React, { FC } from "react"
import { IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

export type BackButtonProps = {
    screen?: string;
    setScreen: (value: string) => void;
}

export const BackButton: FC<BackButtonProps> = ({ screen = 'connect', setScreen }) => {
    return (<>
        <IconButton aria-label="Info" onClick={() => {
            console.log(screen)
            setScreen(screen);
        }} icon={<ArrowBackIcon />} />
    </>);
}

export default BackButton;