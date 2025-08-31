const colors = {
  primary: {
    main: '#FDBA52',
    dark: '#E5A03D',
    light: '#FED485',
    50: '#FEF7E8',
    100: '#FEEBC4',
    200: '#FEDD9C',
    300: '#FED485',
    400: '#FDCA6B',
    500: '#FDBA52',
    600: '#E5A03D',
    700: '#CC8A2B',
    800: '#B3751C',
    900: '#99600F',
  },

  secondary: {
    main: '#4855A4',
    dark: '#3A4485',
    light: '#6B76B8',
    50: '#EEF0F8',
    100: '#D4D9ED',
    200: '#B8C1E0',
    300: '#9BA8D3',
    400: '#8290C6',
    500: '#6B76B8',
    600: '#4855A4',
    700: '#3A4485',
    800: '#2F3567',
    900: '#252849',
  },

  accent: {
    main: '#2A9CDA',
    light: '#5BB3E3',
    dark: '#1F7AB0',
  },

  background: {
    primary: '#0F1F4A',
    secondary: '#1A2332',
    tertiary: '#243041',
  },

  surface: {
    primary: '#1A2332',
    secondary: '#243041',
    tertiary: '#2E3D50',
  },

  text: {
    primary: '#FFFFFF',
    secondary: '#B8C5D6',
    tertiary: '#8A9BAE',
    inverse: '#0F1F4A',
  },

  border: {
    primary: '#243041',
    secondary: '#2E3D50',
    tertiary: '#384A5F',
  },

  status: {
    success: '#2A9CDA',
    warning: '#FDBA52',
    error: '#E74C3C',
    info: '#4855A4',
  },

  overlay: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(15, 31, 74, 0.5)',
    darker: 'rgba(15, 31, 74, 0.8)',
  },

  shadow: {
    light: 'rgba(15, 31, 74, 0.1)',
    medium: 'rgba(15, 31, 74, 0.2)',
    dark: 'rgba(15, 31, 74, 0.4)',
  },
} as const;

export type ColorPalette = typeof colors;
export { colors };
