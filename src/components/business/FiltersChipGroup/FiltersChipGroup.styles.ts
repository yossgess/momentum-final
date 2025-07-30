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
  horizontalContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.sm,
  },
  verticalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    marginRight: theme.spacing.sm,
  },
});
