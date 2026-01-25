import { MD3DarkTheme } from 'react-native-paper';

// Foosball Red & Blue Theme with Glassmorphism (Dark Mode Only)
export const colors = {
  // Team Colors
  red: {
    primary: '#E53935',
    light: '#FF6F60',
    dark: '#AB000D',
    transparent: 'rgba(229, 57, 53, 0.15)',
    glow: 'rgba(229, 57, 53, 0.3)',
  },
  blue: {
    primary: '#1E88E5',
    light: '#6AB7FF',
    dark: '#005CB2',
    transparent: 'rgba(30, 136, 229, 0.15)',
    glow: 'rgba(30, 136, 229, 0.3)',
  },
  // Dark theme neutrals (primary theme)
  background: '#0A0A0F',
  surface: '#12121A',
  card: 'rgba(255, 255, 255, 0.05)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  // Status
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  // Medals
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
};

// Glass styling utilities (dark mode only)
export const glassStyles = {
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
  cardHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  blur: 20,
};

// Gradient backgrounds (dark mode only)
export const gradients = {
  primary: ['#0A0A0F', '#0F0F14', '#14141A'],
  red: ['rgba(229, 57, 53, 0.1)', 'transparent'],
  blue: ['rgba(30, 136, 229, 0.1)', 'transparent'],
  radialRed: ['rgba(229, 57, 53, 0.15)', 'transparent'],
  radialBlue: ['rgba(30, 136, 229, 0.15)', 'transparent'],
};

// React Native Paper custom theme (dark only)
export const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.red.primary,
    onPrimary: '#FFFFFF',
    primaryContainer: colors.red.dark,
    secondary: colors.blue.primary,
    onSecondary: '#FFFFFF',
    secondaryContainer: colors.blue.dark,
    tertiary: colors.blue.light,
    error: colors.error,
    onError: '#FFFFFF',
    background: colors.background,
    onBackground: colors.text,
    surface: colors.surface,
    onSurface: colors.text,
    surfaceVariant: colors.card,
    onSurfaceVariant: colors.textSecondary,
    outline: colors.cardBorder,
    elevation: {
      level0: 'transparent',
      level1: colors.card,
      level2: 'rgba(255, 255, 255, 0.07)',
      level3: 'rgba(255, 255, 255, 0.09)',
      level4: 'rgba(255, 255, 255, 0.11)',
      level5: 'rgba(255, 255, 255, 0.13)',
    },
  },
};

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius scale
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Shadow presets
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  }),
};
