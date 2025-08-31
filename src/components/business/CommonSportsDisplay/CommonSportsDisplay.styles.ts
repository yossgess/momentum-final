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
    color: theme.colors.text.inverse,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scrollView: {
    flexGrow: 0,
    overflow: 'visible', // Prevent clipping
  },
  chipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs, // Add vertical padding to prevent cropping
    overflow: 'visible', // Ensure chips are not clipped
  },
  chip: {
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.xs, // Add bottom margin for better spacing
  },
});
