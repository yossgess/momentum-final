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
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#F1F3F5',
  },

  surface: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#E9ECEF',
  },

  text: {
    primary: '#0F1F4A',
    secondary: '#495057',
    tertiary: '#6C757D',
    inverse: '#FFFFFF',
  },

  border: {
    primary: '#DEE2E6',
    secondary: '#CED4DA',
    tertiary: '#ADB5BD',
  },

  status: {
    success: '#2A9CDA',
    warning: '#FDBA52',
    error: '#E74C3C',
    info: '#4855A4',
  },

  overlay: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.3)',
    darker: 'rgba(0, 0, 0, 0.5)',
  },

  shadow: {
    light: 'rgba(0, 0, 0, 0.08)',
    medium: 'rgba(0, 0, 0, 0.12)',
    dark: 'rgba(0, 0, 0, 0.16)',
  },
} as const;

export type ColorPalette = typeof colors;
export { colors };
