import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    minHeight: 48,
  },
  inputContainerFocused: {
    borderColor: theme.colors.primary.main,
  },
  inputContainerError: {
    borderColor: theme.colors.status.error,
  },
  inputContainerDisabled: {
    backgroundColor: theme.colors.surface.secondary,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.sm,
  },
  inputMultiline: {
    textAlignVertical: 'top',
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  leftIcon: {
    marginRight: theme.spacing.sm,
  },
  rightIcon: {
    marginLeft: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.status.error,
    marginTop: theme.spacing.xs,
  },
  helperText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
});
