import React, { FC } from "react"
import { IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

export type BackButtonProps = {
    screen?: string;
    setScreen: (value: string) => void;
    onClick?: () => void;
}

export const BackButton: FC<BackButtonProps> = ({ screen = 'connect', setScreen, onClick }) => {
    return (<>
        <IconButton aria-label="Info" onClick={() => {
            console.log(screen)
            setScreen(screen);

            if (onClick) {
                onClick();
            }

        }} icon={<ArrowBackIcon />} />
    </>);
}

export default BackButton;