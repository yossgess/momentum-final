import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    maxHeight: 120,
  },
  attachButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    maxHeight: 100,
  },
  inputDisabled: {
    color: theme.colors.text.tertiary,
  },
  sendButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginLeft: theme.spacing.xs,
  },
  sendButtonActive: {
    backgroundColor: theme.colors.primary.main,
  },
});
