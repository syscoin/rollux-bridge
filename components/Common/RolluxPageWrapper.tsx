import { ChakraTheme, ChakraProvider, Flex, Container, Alert, AlertIcon, AlertDescription } from "@chakra-ui/react"
import React, { FC } from "react"
import Head from "next/head"
import { RolluxHeader } from "components/RolluxHeader"
import { chakraTheme as theme } from "components/chakraTheme"

export type RolluxPageWrapperProps = {
    title: string,
    description: string,
    children: React.ReactNode,
    blockerText: string | null,
}



export const RolluxPageWrapper: FC<RolluxPageWrapperProps> = ({ title, description, blockerText = null, children }) => {
    return (
        <>
            <Head>
                <title>Syscoin Bridge | Rollux & NEVM | {title}</title>
                <link rel="shortcut icon" href="/favicon.ico" />
                <meta name="description" content={`Syscoin Trustless Bridge | ${description}`} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <RolluxHeader />

            <Flex
                id="bg"
                boxSize={{ base: undefined, xl: '100%' }}
                overflow="visible"
                position={{ base: 'initial', xl: 'absolute' }}
                bg="#28282F"
                top="0"
                p={{ base: '16px', xl: '100px' }}
                clipPath={{
                    base: undefined,
                    xl: 'polygon(0% -15%, 100% 120%, 100% 100%, 0% 100%)',
                }}
                pb={{ base: '1vh', xl: '100px' }}
                zIndex={-1}
                w="100%"
            >
            </Flex>

            <Container
                padding={6}
                boxShadow={`2px 3px ${theme.colors.brand.primary}`}
                borderRadius="12px"
                border={`1px solid ${theme.colors.brand.primary}`}
                justifyContent="center"
                maxWidth={'990px'}
                marginTop={'10px'}
                backgroundColor={'white'}
            >
                {blockerText && <>
                    <Alert status={'error'}
                        padding={5}
                    >
                        <AlertIcon />
                        <AlertDescription>
                            {blockerText}
                        </AlertDescription>
                    </Alert>
                </>}

                {null === blockerText && children}
            </Container>
        </>
    )
}