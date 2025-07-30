import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  border: {
    borderColor: theme.colors.primary.main,
  },
});
