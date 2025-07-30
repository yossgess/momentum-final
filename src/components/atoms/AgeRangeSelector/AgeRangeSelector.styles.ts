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
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  slidersContainer: {
    gap: theme.spacing.md,
  },
  sliderWrapper: {
    marginBottom: theme.spacing.sm,
  },
  sliderLabel: {
    marginBottom: theme.spacing.xs,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  thumb: {
    backgroundColor: theme.colors.primary.main,
    width: 20,
    height: 20,
  },
});
