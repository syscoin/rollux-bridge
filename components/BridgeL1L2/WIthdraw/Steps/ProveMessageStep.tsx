import { Alert, Spinner, Card, CardHeader, CardBody, List, Heading, Text, ListIcon, ListItem, Button } from '@chakra-ui/react';
import React, { FC } from 'react'
import { CheckCircleIcon, InfoOutlineIcon } from "@chakra-ui/icons"
import { useLocalStorage } from 'usehooks-ts';

export type ProveMessageStepProps = {
    onClickSwitchNetwork: () => void;
    chainId: number;
    requiredChainId: number;
    onClickProveMessage: () => void;
    proveTxHash: string;
}

export const ProveMessageStep: FC<ProveMessageStepProps> = ({ onClickSwitchNetwork, chainId, requiredChainId, onClickProveMessage, proveTxHash }) => {

    return (<div>

        <List spacing={3}>
            <ListItem>

                <Card>
                    <CardBody>

                        <Heading size={'s'} sx={{ marginBottom: 3 }}>
                            <ListIcon as={chainId === requiredChainId ? CheckCircleIcon : InfoOutlineIcon} color='green.500' />
                            Switch Network to L1 before prove withdrawal.
                        </Heading>

                        {chainId !== requiredChainId && <>
                            <Button variant={'primary'} onClick={() => onClickSwitchNetwork()}>
                                Switch Network
                            </Button>
                        </>}

                    </CardBody>
                </Card>

            </ListItem>
            <ListItem>

                <Card>
                    <CardBody>

                        <Heading size={'s'} sx={{ marginBottom: 3 }}>
                            <ListIcon as={proveTxHash !== '' ? CheckCircleIcon : InfoOutlineIcon} color='green.500' />
                            Prove withdrawal
                        </Heading>


                        {proveTxHash === '' && <>
                            <Button variant={'primary'} onClick={() => onClickProveMessage()}>
                                Prove Withdrawal
                            </Button>
                        </>}



                    </CardBody>
                </Card>

            </ListItem>
            <ListItem>

                <Card>
                    <CardBody>

                        <Heading size={'s'} sx={{ marginBottom: 3 }}>
                            {proveTxHash !== '' && <Spinner sx={{ marginRight: 2 }} color='green.500' />}
                            Wait until message will be proven in L1. Might take some time. You can close this window.
                        </Heading>
                    </CardBody>
                </Card>

            </ListItem>
        </List>
    </div>);
}

export default ProveMessageStep;