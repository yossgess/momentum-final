import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  icon: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  description: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  action: {
    minWidth: 120,
  },
});
