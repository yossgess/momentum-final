import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
    backgroundColor: theme.colors.border.primary,
  },
  vertical: {
    height: '100%',
    backgroundColor: theme.colors.border.primary,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  labelDivider: {
    flex: 1,
  },
  labelText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginHorizontal: theme.spacing.md,
  },
});
