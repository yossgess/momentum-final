import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.md,
  },
  scrollView: {
    flexGrow: 0,
  },
  list: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.sm,
  },
  listItem: {
    marginRight: theme.spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  gridItem: {
    flex: 0.48,
  },
});
