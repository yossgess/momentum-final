import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: theme.colors.shadow.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  imageCarousel: {
    height: 400,
  },
  imageContainer: {
    width: SCREEN_WIDTH - 32,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 4,
  },
  indicator: {
    flex: 1,
    height: 3,
    backgroundColor: theme.colors.overlay.light,
    borderRadius: 2,
  },
  activeIndicator: {
    backgroundColor: theme.colors.text.primary,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  locationText: {
    marginLeft: theme.spacing.xs,
  },
  bio: {
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  sports: {
    marginBottom: theme.spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.xl,
  },
  nopeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.surface.secondary,
    borderWidth: 2,
    borderColor: theme.colors.status.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.surface.secondary,
    borderWidth: 2,
    borderColor: theme.colors.status.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
