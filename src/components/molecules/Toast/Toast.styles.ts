import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 1000,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
  },
  success: {
    borderColor: theme.colors.status.success,
  },
  error: {
    borderColor: theme.colors.status.error,
  },
  warning: {
    borderColor: theme.colors.status.warning,
  },
  info: {
    borderColor: theme.colors.status.info,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  message: {
    flex: 1,
  },
});
