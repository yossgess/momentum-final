import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
  },
  label: {
    marginBottom: theme.spacing.md,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  optionsContainer: {
    marginBottom: theme.spacing.md,
  },
  optionsContent: {
    paddingHorizontal: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  optionButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.surface.secondary,
    backgroundColor: theme.colors.surface.primary,
    marginRight: theme.spacing.xs,
    minWidth: 50,
    alignItems: 'center',
  },
  optionButtonActive: {
    borderColor: theme.colors.primary.main,
    backgroundColor: theme.colors.primary.light,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
  },
});
