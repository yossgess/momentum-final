import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  actionsContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  selectAllButton: {
    minWidth: 120,
    paddingHorizontal: theme.spacing.lg,
  },
  categoryContainer: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    width: '100%',
    minHeight: 60, // Ensures consistent height even when collapsed
    ...theme.shadows.sm,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
    minHeight: 60, // Consistent header height
    width: '100%',
  },
  categoryHeaderExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.secondary,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryTitleText: {
    flex: 1,
    fontSize: theme.typography.fontSize.lg,
  },
  categoryBadge: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
    minWidth: 24,
    alignItems: 'center',
  },
  categoryBadgeText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  categoryTitle: {
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  categoryChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    justifyContent: 'flex-start',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface.primary,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  chip: {
    marginBottom: theme.spacing.xs,
  },
  counter: {
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'center',
    minWidth: 120,
  },
  counterText: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
