import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 48,
  },
  buttonSm: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 36,
  },
  buttonLg: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    minHeight: 56,
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: theme.colors.primary.main,
  },
  secondary: {
    backgroundColor: theme.colors.secondary.main,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  danger: {
    backgroundColor: theme.colors.status.error,
  },
  iconButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    minHeight: 40,
    width: 40,
    borderRadius: theme.borderRadius.full,
  },
  disabled: {
    opacity: 0.5,
  },
  loading: {
    opacity: 0.7,
  },
  text: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
  },
  textPrimary: {
    color: theme.colors.text.primary,
  },
  textSecondary: {
    color: theme.colors.text.primary,
  },
  textGhost: {
    color: theme.colors.primary.main,
  },
  textDanger: {
    color: theme.colors.text.primary,
  },
  textIconButton: {
    color: theme.colors.text.primary,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  iconOnly: {
    marginRight: 0,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
