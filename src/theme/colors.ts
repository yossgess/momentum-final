const colors = {
  primary: {
    main: '#00A89D',
    dark: '#0F4E4D',
    light: '#6FD9D1',
    50: '#E0F7F5',
    100: '#B3EAE6',
    200: '#80DCD5',
    300: '#6FD9D1',
    400: '#3FD0C4',
    500: '#00A89D',
    600: '#00897F',
    700: '#006E67',
    800: '#00514E',
    900: '#003835',
  },

  secondary: {
    main: '#1B1B1B',
    dark: '#0F0F0F',
    light: '#2F2F2F',
    50: '#E6E6E6',
    100: '#CCCCCC',
    200: '#999999',
    300: '#666666',
    400: '#3F3F3F',
    500: '#1B1B1B',
    600: '#141414',
    700: '#0F0F0F',
    800: '#0A0A0A',
    900: '#050505',
  },

  accent: {
    main: '#A9EAE7',
    light: '#D0F6F4',
    dark: '#61C6C2',
  },

  background: {
    primary: '#0B0D10',
    secondary: '#1C1E22',
    tertiary: '#2A2D33',
  },

  surface: {
    primary: '#1C1E22',
    secondary: '#2A2D33',
    tertiary: '#3A3D44',
  },

  text: {
    primary: '#FFFFFF',
    secondary: '#A4A6AC',
    tertiary: '#6B6E75',
    inverse: '#0B0D10',
  },

  border: {
    primary: '#2A2D33',
    secondary: '#3A3D44',
    tertiary: '#4A4D54',
  },

  status: {
    success: '#00C853',
    warning: '#FF9100',
    error: '#FF3D3D',
    info: '#00A89D',
  },

  overlay: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(0, 0, 0, 0.5)',
    darker: 'rgba(0, 0, 0, 0.8)',
  },

  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(0, 0, 0, 0.4)',
  },
} as const;

export type ColorPalette = typeof colors;
export { colors };
