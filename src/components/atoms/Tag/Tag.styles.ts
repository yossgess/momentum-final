import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  containerSm: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  containerLg: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  default: {
    backgroundColor: theme.colors.surface.secondary,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  selected: {
    backgroundColor: theme.colors.primary.main,
  },
  filled: {
    backgroundColor: theme.colors.primary.main,
  },
  closable: {
    backgroundColor: theme.colors.surface.secondary,
  },
  text: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  textSm: {
    fontSize: theme.typography.fontSize.xs,
  },
  textMd: {
    fontSize: theme.typography.fontSize.sm,
  },
  textLg: {
    fontSize: theme.typography.fontSize.base,
  },
  textOutlined: {
    color: theme.colors.text.secondary,
  },
  textSelected: {
    color: theme.colors.text.primary,
  },
  icon: {
    marginRight: theme.spacing.xs,
  },
  closeIcon: {
    marginLeft: theme.spacing.xs,
  },
  disabled: {
    opacity: 0.5,
  },
  textDisabled: {
    color: theme.colors.text.tertiary,
  },
  closeButton: {
    marginLeft: theme.spacing.xs,
    padding: 2,
  },
  containerMd: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
});
