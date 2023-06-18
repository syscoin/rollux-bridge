import { Alert, Spinner, Card, CardHeader, CardBody, List, Heading, Text, ListIcon, ListItem, Button } from '@chakra-ui/react';
import React, { FC } from 'react'
import { CheckCircleIcon, InfoOutlineIcon } from "@chakra-ui/icons"
import { useLocalStorage } from 'usehooks-ts';

export type RelayMessageStepProps = {
    onClickSwitchNetwork: () => void;
    chainId: number;
    requiredChainId: number;
    onClickRelayMessage: () => void;
    relayTxHash: string;
}

export const RelayMessageStep: FC<RelayMessageStepProps> = ({ onClickSwitchNetwork, chainId, requiredChainId, onClickRelayMessage, relayTxHash }) => {

    return (<div>

        <List spacing={3}>
            <ListItem>

                <Card>
                    <CardBody>

                        <Heading size={'s'} sx={{ marginBottom: 3 }}>
                            <ListIcon as={chainId === requiredChainId ? CheckCircleIcon : InfoOutlineIcon} color='green.500' />
                            Switch Network to L1 before finalize withdrawal.
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
                            <ListIcon as={relayTxHash !== '' ? CheckCircleIcon : InfoOutlineIcon} color='green.500' />
                            Finalize withdrawal
                        </Heading>


                        {(relayTxHash === '' && chainId === requiredChainId) && <>
                            <Button variant={'primary'} onClick={() => onClickRelayMessage()}>
                                Finalize Withdrawal
                            </Button>
                        </>}



                    </CardBody>
                </Card>

            </ListItem>
            <ListItem>

                <Card>
                    <CardBody>

                        <Heading size={'s'} sx={{ marginBottom: 3 }}>
                            {relayTxHash !== '' && <Spinner sx={{ marginRight: 2 }} color='green.500' />}
                            Wait until message will be finalized in L1. Might take some time. You can close this window.
                        </Heading>
                    </CardBody>
                </Card>

            </ListItem>
        </List>
    </div>);
}

export default RelayMessageStep;