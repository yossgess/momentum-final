import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: theme.colors.shadow.dark,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    marginBottom: 0, // Remove bottom margin to extend to bottom nav
  },
  // Full-screen variant for DiscoveryScreen
  fullScreenContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface.primary,
    borderRadius: 0, // No border radius for full screen
    overflow: 'hidden',
    elevation: 0,
    shadowOpacity: 0,
    margin: 0,
    marginBottom: 85, // Account for bottom navigation height
  },
  imageCarousel: {
    height: SCREEN_HEIGHT * 0.6, // Larger image area
  },
  fullScreenImageCarousel: {
    height: SCREEN_HEIGHT * 0.65, // Even larger for full screen
  },
  fullCarousel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
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
  bottomLeftContainer: {
    position: 'absolute',
    bottom: 120, // Positioned at 120 pixels from bottom
    left: theme.spacing.lg,
    right: theme.spacing.lg, // Use right constraint instead of maxWidth
    padding: theme.spacing.sm, // Reduced padding to be less intrusive
    overflow: 'visible', // Ensure content is not clipped
  },
  actionButtonsOverlay: {
    position: 'absolute',
    bottom: 80, // Position above bottom navigation bar
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  actionButton: {
    // Individual action button styling if needed
  },
  textContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  nameText: {
    color: theme.colors.text.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bioText: {
    color: theme.colors.text.primary,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  locationText: {
    marginLeft: theme.spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bio: {
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  sports: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    overflow: 'visible', // Prevent sports chips from being clipped
  },
});
