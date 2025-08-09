import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: theme.spacing.lg,
    borderTopRightRadius: theme.spacing.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonOnly: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: theme.spacing.md,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Space for floating action buttons
  },
  imageCarouselContainer: {
    height: 400,
    backgroundColor: theme.colors.surface.secondary,
  },
  profileInfo: {
    padding: theme.spacing.lg,
  },
  nameAgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  nameText: {
    flex: 1,
  },
  ageText: {
    color: theme.colors.text.secondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  locationIcon: {
    marginRight: theme.spacing.xs,
  },
  locationText: {
    color: theme.colors.text.secondary,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  bioText: {
    lineHeight: 22,
    color: theme.colors.text.secondary,
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  sportTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.secondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  sharedSportTag: {
    backgroundColor: theme.colors.primary.light,
    borderColor: theme.colors.primary.main,
  },
  sportIcon: {
    marginRight: theme.spacing.xs,
  },
  sportText: {
    fontSize: 14,
  },
  sharedSportText: {
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
  availabilityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  availabilityTag: {
    backgroundColor: theme.colors.surface.secondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  availabilityText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  floatingActions: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  actionButton: {
    // Individual button styles handled by components
  },
});
