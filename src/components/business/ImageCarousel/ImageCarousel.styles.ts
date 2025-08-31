import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  scrollView: {
    height: '100%',
  },
  imageContainer: {
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  indicators: {
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
});
