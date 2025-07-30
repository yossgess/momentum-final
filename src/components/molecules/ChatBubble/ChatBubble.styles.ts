import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  senderContainer: {
    alignItems: 'flex-end',
  },
  receiverContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  senderBubble: {
    backgroundColor: theme.colors.primary.main,
    borderBottomRightRadius: theme.borderRadius.sm,
  },
  receiverBubble: {
    backgroundColor: theme.colors.surface.secondary,
    borderBottomLeftRadius: theme.borderRadius.sm,
  },
  message: {
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  timestamp: {
    fontSize: 11,
  },
  status: {
    fontSize: 11,
    marginLeft: theme.spacing.xs,
  },
});
