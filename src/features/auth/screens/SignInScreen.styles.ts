import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  signInButton: {
    marginTop: theme.spacing['2xl'],
    marginBottom: theme.spacing.lg,
  },
  oauthContainer: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  oauthButton: {
    marginBottom: theme.spacing.sm,
  },
  signUpButton: {
    marginTop: theme.spacing.md,
  },
});
