import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: theme.colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  specialty: {
    marginTop: theme.spacing.xs,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  stars: {
    flexDirection: 'row',
    marginRight: theme.spacing.xs,
  },
  ratingText: {
    marginLeft: theme.spacing.xs,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.status.success,
    marginRight: theme.spacing.xs,
  },
});
