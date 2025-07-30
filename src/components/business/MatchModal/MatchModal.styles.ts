import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.overlay.darker,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    margin: theme.spacing.lg,
    alignItems: 'center',
    elevation: 16,
    shadowColor: theme.colors.shadow.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  title: {
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
    color: theme.colors.primary.main,
  },
  imagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  imageWrapper: {
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: theme.colors.primary.main,
  },
  userImage: {
    width: 120,
    height: 120,
  },
  heartContainer: {
    marginHorizontal: theme.spacing.lg,
  },
  heartIcon: {
    fontSize: 32,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 20,
  },
  actions: {
    width: '100%',
    gap: theme.spacing.md,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
});
