import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
  },
  
  // Distance Slider Styles
  distanceContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  distanceSlider: {
    width: '100%',
    height: 40,
    marginVertical: theme.spacing.sm,
  },
  distanceLabelContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  distanceLabel: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 16,
    minWidth: 60,
    alignItems: 'center',
  },
  distanceLabelText: {
    color: theme.colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  distanceRangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  
  // Age Range Slider Styles
  ageRangeContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  ageRangeSlider: {
    width: '100%',
    height: 40,
    marginVertical: theme.spacing.sm,
  },
  ageRangeLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  ageRangeLabel: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 16,
    minWidth: 50,
    alignItems: 'center',
  },
  ageRangeLabelText: {
    color: theme.colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  ageRangeMinMaxLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  
  // Common styles
  rangeText: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
  },
});
