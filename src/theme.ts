import { extendTheme } from '@chakra-ui/react'

// Color palette based on asset analysis but with improved contrast
const colors = {
  brand: {
    // Main teal/cyan color found in assets
    50: '#e3f9fb',
    100: '#c5eef1',
    200: '#a1e0e5',
    300: '#7ad0d7',
    400: '#51bec7',
    500: '#29686c', // Our primary accent from analysis
    600: '#1c5458', // Darker variant
    700: '#183d3f', // From keyboard.png
    800: '#113738', // From mouse.png
    900: '#0f1e41', // From logo.png - more blue variant
  },
  background: {
    primary: '#000101', // Almost black with slight cyan tint
    secondary: '#0a141e', // Darker blue for better contrast
    tertiary: '#122c2e', // Darker cyan for cards
    card: '#112233', // Darker blue to contrast with teal images
    highlight: '#1d4244', // For hover states and highlights
    cardOverlay: 'rgba(17, 34, 51, 0.85)', // Semi-transparent overlay for text on images
  },
  text: {
    primary: '#ffffff',
    secondary: '#a1e0e5', // Light brand color for secondary text
    accent: '#51bec7', // Brighter cyan for accents and highlights
    muted: '#718096', // For less important text
    dark: '#0a141e', // Dark text for light backgrounds
  }
}

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors,
  fonts: {
    heading: `'Press Start 2P', monospace`,
    body: `system-ui, sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: colors.background.primary,
        color: colors.text.primary,
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        outline: {
          borderColor: 'brand.300',
          color: 'text.primary',
          _hover: {
            bg: 'background.highlight',
          },
        },
        ghost: {
          color: 'brand.300',
          _hover: {
            bg: 'background.highlight',
          }
        }
      },
    },
    Box: {
      variants: {
        card: {
          bg: 'background.card',
          borderRadius: 'lg',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.24)',
          borderColor: 'brand.700',
          borderWidth: '1px',
          transition: 'all 0.2s ease-in-out',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 10px -1px rgba(0, 0, 0, 0.4), 0 4px 6px -1px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    Progress: {
      baseStyle: {
        filledTrack: {
          bg: 'brand.400',
        },
        track: {
          bg: 'background.highlight',
        },
      },
    },
    Tooltip: {
      baseStyle: {
        bg: 'background.secondary',
        color: 'text.secondary',
        borderColor: 'brand.700',
        borderWidth: '1px',
      },
    },
    Heading: {
      baseStyle: {
        color: 'text.secondary',
        letterSpacing: '0.5px',
      },
      sizes: {
        xl: {
          fontSize: '1.5rem',
          lineHeight: '1.4',
        },
        lg: {
          fontSize: '1.2rem',
          lineHeight: '1.4',
        },
        md: {
          fontSize: '1rem',
          lineHeight: '1.4',
        },
        sm: {
          fontSize: '0.8rem',
          lineHeight: '1.4',
        },
      }
    },
    Text: {
      variants: {
        accent: {
          color: 'text.accent',
        },
        secondary: {
          color: 'text.secondary',
        },
        muted: {
          color: 'text.muted',
        },
        pixel: {
          fontFamily: `'Press Start 2P', monospace`,
          letterSpacing: '0.5px',
        }
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: 'background.secondary',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
          borderWidth: '1px',
          borderColor: 'brand.700',
        },
        header: {
          color: 'text.secondary',
        },
        body: {
          color: 'text.primary',
        },
      },
    },
  },
})

export default theme 