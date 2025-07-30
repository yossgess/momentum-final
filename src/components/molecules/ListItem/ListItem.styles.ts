import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.md,
  },
  icon: {
    marginRight: theme.spacing.md,
  },
  content: {
    flex: 1,
  },
  subtitle: {
    marginTop: theme.spacing.xs,
  },
  badge: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    minWidth: 24,
    alignItems: 'center',
  },
});
