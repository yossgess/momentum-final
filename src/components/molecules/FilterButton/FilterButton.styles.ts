import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  containerActive: {
    borderColor: theme.colors.primary.main,
    backgroundColor: theme.colors.primary[50],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: theme.spacing.sm,
  },
  badge: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    marginLeft: theme.spacing.sm,
    minWidth: 20,
    alignItems: 'center',
  },
});
