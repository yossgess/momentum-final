import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '../../../components/atoms/Button';
import { useAuthStore } from '../../../shared/stores/authStore';
import { theme } from '../../../theme';
import { t } from '../../../shared/utils/i18n';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const ProfileScreen: React.FC = () => {
  const { logout, user } = useAuthStore();

  React.useEffect(() => {
    logEvent(Events.SCREEN_VIEWED, { screenName: 'Profile' });
  }, []);

  const handleSignOut = () => {
    Alert.alert(
      t('profile.signOut'),
      t('profile.signOutConfirmation'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('profile.signOut'),
          style: 'destructive',
          onPress: async () => {
            try {
              logEvent(Events.BUTTON_PRESSED, { buttonName: 'SignOut', userId: user?.id });
              await logout();
              logEvent(Events.LOGIN_SUCCESS, { action: 'logout', userId: user?.id }); // Reuse existing event
            } catch (error) {
              logEvent(Events.LOGIN_FAILED, { 
                action: 'logout',
                userId: user?.id, 
                error: error instanceof Error ? error.message : 'Unknown error' 
              });
              Alert.alert(
                t('common.error'),
                t('profile.signOutError')
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Profile</Text>
        <Text style={styles.subtitle}>Manage your sports profile</Text>
      </View>
      
      <View style={styles.actions}>
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onPress={handleSignOut}
          style={styles.signOutButton}
        >
          {t('profile.signOut')}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  actions: {
    paddingBottom: theme.spacing.xl,
  },
  signOutButton: {
    borderColor: theme.colors.secondary[400], // Use secondary color for destructive outline
  },
});
