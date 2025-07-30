import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginRight: 0,
  },
  buttonSpacing: {
    marginLeft: theme.spacing.sm,
  },
});
