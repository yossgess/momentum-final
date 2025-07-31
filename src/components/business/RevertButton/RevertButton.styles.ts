import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface.secondary,
    ...theme.shadows.sm,
  },
  sm: {
    width: 40,
    height: 40,
  },
  md: {
    width: 48,
    height: 48,
  },
  lg: {
    width: 56,
    height: 56,
  },
  disabled: {
    backgroundColor: theme.colors.surface.tertiary,
    opacity: 0.5,
  },
});
