import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.overlay.darker,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  inlineContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  fullScreenText: {
    color: theme.colors.text.primary,
  },
});
