import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  grid: {
    paddingBottom: theme.spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  sportChip: {
    flex: 0.48,
  },
  counter: {
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
});
