import React, { FC } from "react";
import Image from "next/image";

export type RolluxLogoProps = {
    width?: number;
    height?: number;
}

export const RolluxLogo: FC<RolluxLogoProps> = ({ width, height }) => {
    return (<>
        <Image
            src="/rollux-logo.svg"
            height={width || 48}
            width={height || 48}
            alt="rollux logo"
        />
    </>);
}