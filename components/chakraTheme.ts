import { extendTheme } from "@chakra-ui/react";
import { Roboto } from "next/font/google";

export const roboto = Roboto({
    weight: ['400', '700'],
    subsets: ['latin']
})

export const chakraTheme = extendTheme({
    fonts: {
        body: roboto.style.fontFamily,
        heading: roboto.style.fontFamily,
    },
    colors: {
        brand: {
            primary: '#DBEF88',
            primaryGradient: 'linear-gradient(90.06deg, #DBEF88 -3.26%, #EACF5E 207.26%)',
            secondaryGradient: 'linear-gradient(90deg, #E0E0E0 4.05%, #DBEF88 95.38%)'
        }
    },
    components: {
        Button: {
            variants: {
                primary: {
                    bg: 'brand.primaryGradient',
                    _hover: {
                        _disabled: {
                            bg: 'brand.primaryGradient'
                        }
                    }
                },
                secondary: {
                    bg: 'brand.secondaryGradient',
                    _hover: {
                        _disabled: {
                            bg: 'brand.secondaryGradient'
                        }
                    }
                }
            }
        }
    },
    styles: {
        global: {
            'html': {
                height: '100%'
            },
            'body': {
                minHeight: '100%',
            }
        }
    }
})