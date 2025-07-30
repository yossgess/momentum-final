import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerWithLabel: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  label: {
    marginLeft: theme.spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});
