import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../../components/atoms/Button';
import { Typography } from '../../../components/atoms/Typography';
import { PhotoManagementModal } from '../../../components/molecules/PhotoManagementModal';
import { useAuthStore } from '../../../shared/stores/authStore';
import { profilesService } from '../../../shared/services/profilesService';
import { theme } from '../../../theme';
import { t } from '../../../shared/utils/i18n';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const ProfileScreen: React.FC = () => {
  const { logout, user } = useAuthStore();
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [photos, setPhotos] = useState<(string | null)[]>([]);

  useEffect(() => {
    logEvent(Events.SCREEN_VIEWED, { screenName: 'Profile' });
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    if (!user?.id) return;
    
    try {
      const profile = await profilesService.getProfile(user.id);
      setUserProfile(profile);
      
      // Convert avatar_urls to photo array format
      const avatarUrls = profile?.avatar_urls || [];
      const photoArray: (string | null)[] = new Array(6).fill(null);
      avatarUrls.forEach((url: string, index: number) => {
        if (index < 6) photoArray[index] = url;
      });
      setPhotos(photoArray);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const handlePhotosChange = async (newPhotos: (string | null)[]) => {
    setPhotos(newPhotos);
    
    if (!user?.id) return;
    
    try {
      const avatarUrls = newPhotos.filter(photo => photo !== null) as string[];
      
      await profilesService.updateProfile(user.id, {
        avatar_urls: avatarUrls,
      });
      
      logEvent(Events.PHOTO_UPLOADED, { 
        photoCount: avatarUrls.length,
        context: 'profile_edit',
        mainPhotoUrl: avatarUrls[0] || undefined
      });
    } catch (error) {
      console.error('Failed to update photos:', error);
      Alert.alert('Error', 'Failed to update photos. Please try again.');
    }
  };

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

  const mainPhoto = photos.find(photo => photo !== null);

  return (
    <View style={styles.container}>
      {/* Header with Avatar */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={() => setShowPhotoModal(true)}
          activeOpacity={0.8}
        >
          {mainPhoto ? (
            <Image source={{ uri: mainPhoto }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color={theme.colors.text.tertiary} />
            </View>
          )}
          
          {/* Edit Badge */}
          <View style={styles.editBadge}>
            <Ionicons name="pencil" size={16} color={theme.colors.text.inverse} />
          </View>
        </TouchableOpacity>
        
        <Typography variant="h2" color={theme.colors.text.primary} style={styles.userName}>
          {userProfile?.full_name || user?.email || 'User'}
        </Typography>
      </View>

      <View style={styles.content}>
        <Typography variant="body" color={theme.colors.text.secondary} style={styles.subtitle}>
          Manage your sports profile
        </Typography>
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

      {/* Photo Management Modal */}
      <PhotoManagementModal
        visible={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        photos={photos}
        onPhotosChange={handlePhotosChange}
        maxPhotos={6}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surface.secondary,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surface.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border.secondary,
    borderStyle: 'dashed',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.secondary.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.background.primary,
  },
  userName: {
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  subtitle: {
    textAlign: 'center',
  },
  actions: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  signOutButton: {
    borderColor: theme.colors.secondary.main,
  },
});
