import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
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
});
