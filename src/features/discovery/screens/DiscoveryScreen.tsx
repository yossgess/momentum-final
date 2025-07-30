import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const DiscoveryScreen: React.FC = () => {
  React.useEffect(() => {
    logEvent(Events.SCREEN_VIEWED, { screenName: 'Discovery' });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Discovery Screen</Text>
      <Text style={styles.subtitle}>Swipe to discover sports partners</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  text: {
    fontSize: theme.typography.fontSize['2xl'],
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
