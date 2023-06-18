import { FormControl, FormLabel, Switch, Flex } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";

export type SwitcherOtherProvidersProps = {
    onSwitch: (enabled: boolean) => void;
}

export const SwitcherOtherProviders: FC<SwitcherOtherProvidersProps> = ({ onSwitch }) => {
    const [isChecked, setIsChecked] = useState<boolean>(false);

    const handleChecked = () => {
        setIsChecked(!isChecked)
        onSwitch(!isChecked);
    }

    return (
        <FormControl>
            <Flex direction={'row'} mb={4} justifyContent={'right'}>
                <FormLabel>
                    Fiat & Other networks
                </FormLabel>
                <Switch size={'md'} onChange={handleChecked} />
            </Flex>

        </FormControl>
    )
}

export default SwitcherOtherProviders;