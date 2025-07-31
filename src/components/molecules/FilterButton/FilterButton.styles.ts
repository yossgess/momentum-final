import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    elevation: 4,
    shadowColor: theme.colors.shadow.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  containerActive: {
    // Active state styling if needed
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: theme.spacing.sm,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.status.error,
    borderRadius: theme.borderRadius.full,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: theme.colors.text.primary,
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
