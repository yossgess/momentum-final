import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  selector: {
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 2,
    borderColor: theme.colors.border.primary,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  selectorDisabled: {
    backgroundColor: theme.colors.surface.secondary,
    opacity: 0.6,
  },
  selectorWithImage: {
    borderStyle: 'solid',
    padding: theme.spacing.sm,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  previewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
  },
  previewImageSingle: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.md,
  },
  
  // Enhanced PhotoSelector styles
  photosContainer: {
    paddingHorizontal: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  photoThumbnail: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  mainPhotoThumbnail: {
    borderColor: theme.colors.primary.main,
    borderWidth: 3,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.md,
  },
  mainPhotoBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: theme.colors.surface.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface.secondary,
  },
  addPhotoText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  addPhotoTextDisabled: {
    color: theme.colors.text.tertiary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  emptyStateText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
});
