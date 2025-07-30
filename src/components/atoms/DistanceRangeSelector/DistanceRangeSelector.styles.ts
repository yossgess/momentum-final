import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
  },
  label: {
    marginBottom: theme.spacing.md,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: theme.spacing.sm,
  },
  thumb: {
    backgroundColor: theme.colors.primary.main,
    width: 20,
    height: 20,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
  },
});
