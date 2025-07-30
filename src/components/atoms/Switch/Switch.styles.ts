import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.md,
    flex: 1,
  },
  switchContainer: {
    position: 'relative',
  },
  track: {
    borderRadius: 15,
    justifyContent: 'center',
  },
  trackSm: {
    width: 40,
    height: 20,
  },
  trackMd: {
    width: 50,
    height: 25,
  },
  trackLg: {
    width: 60,
    height: 30,
  },
  trackActive: {
    backgroundColor: theme.colors.primary.main,
  },
  trackInactive: {
    backgroundColor: theme.colors.surface.tertiary,
  },
  thumb: {
    position: 'absolute',
    backgroundColor: theme.colors.text.primary,
    borderRadius: 50,
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbSm: {
    width: 16,
    height: 16,
    top: 2,
  },
  thumbMd: {
    width: 21,
    height: 21,
    top: 2,
  },
  thumbLg: {
    width: 26,
    height: 26,
    top: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
