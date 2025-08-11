import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },

  headerRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },

  dayHeaderCell: {
    width: 80,
    height: 32,
  },

  periodHeaderCell: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerText: {
    color: theme.colors.text.secondary,
    fontWeight: '600',
    textAlign: 'center',
  },

  dayRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
  },

  dayLabelCell: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    paddingRight: theme.spacing.sm,
  },

  dayLabel: {
    color: theme.colors.text.primary,
    fontWeight: '500',
  },

  slotCell: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  slot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface.secondary,
    borderWidth: 2,
    borderColor: theme.colors.border.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  slotSelected: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },

  slotDisplayMode: {
    opacity: 0.8,
  },

  slotIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  slotIndicatorFilled: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.surface.primary,
  },

  modeIndicator: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.secondary,
    alignItems: 'center',
  },

  modeIndicatorText: {
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
});
