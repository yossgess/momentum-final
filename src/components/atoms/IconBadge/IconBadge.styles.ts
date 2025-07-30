import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  iconContainer: {
    padding: theme.spacing.sm,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.status.error,
    borderRadius: theme.borderRadius.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  badgeText: {
    color: theme.colors.text.primary,
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.status.error,
    position: 'absolute',
    top: 4,
    right: 4,
  },
});
