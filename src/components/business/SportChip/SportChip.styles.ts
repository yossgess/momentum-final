import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  filled: {
    backgroundColor: theme.colors.overlay.darker,
    borderWidth: 2,
    borderColor: theme.colors.overlay.medium,
    shadowColor: theme.colors.shadow.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  outlined: {
    backgroundColor: theme.colors.surface.secondary,
    borderWidth: 2,
    borderColor: theme.colors.border.primary,
    shadowColor: theme.colors.shadow.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 4,
  },
  gradient: {
    backgroundColor: theme.colors.overlay.darker,
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
    shadowColor: theme.colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  selected: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.overlay.medium,
    borderWidth: 2,
    shadowColor: theme.colors.shadow.dark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 6,
  },
  disabled: {
    opacity: 0.5,
  },
  sm: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  md: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  lg: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: theme.spacing.xs,
  },
});
