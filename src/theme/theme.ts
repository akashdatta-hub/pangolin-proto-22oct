import { createTheme } from '@mui/material/styles';

// Pangolin Design System
// Colors sourced from actual Figma UI screens and Vibrant + Sunny design system

export const colors = {
  // Primary (Purple) - from UI screens
  primary: {
    main: '#743799',      // Primary 40 - buttons, interactive elements
    light: '#E6D9F0',     // Primary 95 - light backgrounds
    dark: '#200034',      // Tertiary Dark - text, headers
    contrastText: '#FFFFFF',
  },

  // Secondary (Pink) - from UI screens
  secondary: {
    main: '#E16BBA',      // Secondary 60 - accents, highlights
    light: '#F5E0EF',     // Secondary 95
    dark: '#A03B7A',      // Secondary 30
    contrastText: '#FFFFFF',
  },

  // Tertiary (Orange/Peach) - from UI screens
  tertiary: {
    main: '#FEBA7B',      // Tertiary 70 - progress, active states
    light: '#FFF4EB',     // Primary Light - backgrounds
    dark: '#C8853A',      // Tertiary 40
    contrastText: '#200034',
  },

  // Success (Green) - from design system specification
  success: {
    main: '#489D26',      // Success text
    light: '#D7FFB8',     // Success background
    dark: '#2D6418',
    contrastText: '#FFFFFF',
  },

  // Error (Red) - from design system specification
  error: {
    main: '#B3261E',      // Error text
    light: '#F9DEDC',     // Error background
    dark: '#8C1D18',
    contrastText: '#FFFFFF',
  },

  // Neutral (Grey scale) - from UI screens
  neutral: {
    100: '#FFFFFF',
    99: '#FDFCFF',
    98: '#FBF9FC',
    95: '#F4F1F5',
    90: '#EAEBEF',       // Light Grey
    80: '#C9CBD4',
    70: '#A8ABB5',
    60: '#888B96',
    50: '#696C77',
    40: '#4B4E59',
    30: '#2E313B',
    20: '#1C1E25',
    10: '#0F1115',
    0: '#000000',
  },

  // Background colors
  background: {
    default: '#FFF4EB',   // Tertiary 100 - main app background
    paper: '#FFFFFF',      // Card backgrounds
    elevated: '#F4F1F5',   // Elevated surfaces
  },
};

// Typography configuration using Material 3 scale
export const typography = {
  fontFamily: '"Open Sans", "Roboto", "Helvetica", "Arial", sans-serif',
  displayFont: '"Leckerli One", cursive',

  // Material 3 Typography Scale
  displayLarge: {
    fontFamily: '"Leckerli One", cursive',
    fontSize: '57px',
    fontWeight: 400,
    lineHeight: '64px',
    letterSpacing: '-0.25px',
  },
  displayMedium: {
    fontFamily: '"Leckerli One", cursive',
    fontSize: '45px',
    fontWeight: 400,
    lineHeight: '52px',
    letterSpacing: '0px',
  },
  displaySmall: {
    fontFamily: '"Leckerli One", cursive',
    fontSize: '36px',
    fontWeight: 400,
    lineHeight: '44px',
    letterSpacing: '0px',
  },

  headlineLarge: {
    fontFamily: '"Leckerli One", cursive',
    fontSize: '32px',
    fontWeight: 400,
    lineHeight: '40px',
    letterSpacing: '0px',
  },
  headlineMedium: {
    fontFamily: '"Leckerli One", cursive',
    fontSize: '28px',
    fontWeight: 400,
    lineHeight: '36px',
    letterSpacing: '0px',
  },
  headlineSmall: {
    fontFamily: '"Leckerli One", cursive',
    fontSize: '24px',
    fontWeight: 400,
    lineHeight: '32px',
    letterSpacing: '0px',
  },

  titleLarge: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '22px',
    fontWeight: 400,
    lineHeight: '28px',
    letterSpacing: '0px',
  },
  titleMedium: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '24px',
    letterSpacing: '0.15px',
  },
  titleSmall: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    letterSpacing: '0.1px',
  },

  bodyLarge: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
    letterSpacing: '0.5px',
  },
  bodyMedium: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    letterSpacing: '0.25px',
  },
  bodySmall: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '16px',
    letterSpacing: '0.4px',
  },

  labelLarge: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    letterSpacing: '0.1px',
  },
  labelMedium: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    letterSpacing: '0.5px',
  },
  labelSmall: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '11px',
    fontWeight: 500,
    lineHeight: '16px',
    letterSpacing: '0.5px',
  },
};

// Create Material UI theme
export const theme = createTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    error: colors.error,
    background: colors.background,
  },
  typography: {
    fontFamily: typography.fontFamily,
    h1: typography.displayLarge,
    h2: typography.displayMedium,
    h3: typography.displaySmall,
    h4: typography.headlineLarge,
    h5: typography.headlineMedium,
    h6: typography.headlineSmall,
    subtitle1: typography.titleLarge,
    subtitle2: typography.titleMedium,
    body1: typography.bodyLarge,
    body2: typography.bodyMedium,
    button: typography.labelLarge,
    caption: typography.bodySmall,
    overline: typography.labelSmall,
  },
  shape: {
    borderRadius: 12, // Rounded corners from UI screens
  },
  spacing: 8, // Material 3 base spacing unit
});

export default theme;
