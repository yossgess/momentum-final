import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  scrollView: {
    flexGrow: 0,
  },
  chipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.sm,
  },
  chip: {
    marginRight: theme.spacing.sm,
  },
  counter: {
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
});
