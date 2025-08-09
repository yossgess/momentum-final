import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: theme.colors.shadow.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sm: {
    width: 40,
    height: 40,
  },
  md: {
    width: 56,
    height: 56,
  },
  lg: {
    width: 72,
    height: 72,
  },
  disabled: {
    borderColor: theme.colors.border.secondary,
    opacity: 0.5,
  },
});
