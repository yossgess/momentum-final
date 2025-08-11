import React from 'react';
import { View, Modal, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ProfileModalProps } from './ProfileModal.types';
import { styles } from './ProfileModal.styles';
import { theme } from '../../../theme';
import { Typography } from '../../atoms/Typography';
import { ImageCarousel } from '../ImageCarousel';
import { ChallengeButton } from '../ChallengeButton';
import { NopeButton } from '../NopeButton';
import { RevertButton } from '../RevertButton';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { t } from '../../../shared/utils/i18n';
import { formatDistance } from '../../../shared/utils/formatDistance';

export const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  profile,
  onClose,
  onChallenge,
  onNope,
  onRevert,
  canRevert = false,
  isLoading = false,
}) => {

  const handleClose = () => {
    logEvent(Events.MODAL_CLOSED, { modalType: 'profile_details' });
    onClose();
  };

  const handleChallenge = () => {
    logEvent(Events.CHALLENGE_BUTTON_PRESSED, { 
      source: 'profile_modal',
      profileId: profile?.id 
    });
    onChallenge();
  };

  const handleNope = () => {
    logEvent(Events.NOPE_BUTTON_PRESSED, { 
      source: 'profile_modal',
      profileId: profile?.id 
    });
    onNope();
  };

  const handleRevert = () => {
    logEvent('revert_button_pressed', { 
      source: 'profile_modal',
      canRevert 
    });
    onRevert();
  };

  const formatAvailability = (availability: string[]) => {
    return availability.map(slot => {
      // Convert availability format like "monday_morning" to "Monday Morning"
      const [day, period] = slot.split('_');
      const formattedDay = day.charAt(0).toUpperCase() + day.slice(1);
      const formattedPeriod = period.charAt(0).toUpperCase() + period.slice(1);
      return `${formattedDay} ${formattedPeriod}`;
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (!profile) return null;

  const age = profile.date_of_birth ? calculateAge(profile.date_of_birth) : 25;
  const images = profile.avatar_urls || [];
  const availability = profile.availability ? 
    (Array.isArray(profile.availability) ? profile.availability : []) : [];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.overlay}>
        <View style={styles.container}>
          {/* Close Button Only */}
          <Pressable style={styles.closeButtonOnly} onPress={handleClose}>
            <Ionicons 
              name="close" 
              size={24} 
              color={theme.colors.text.primary} 
            />
          </Pressable>

          {/* Content */}
          <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
            {/* Image Carousel */}
            {images.length > 0 && (
              <View style={styles.imageCarouselContainer}>
                <ImageCarousel
                  images={images}
                  onImagePress={(index) => {
                    logEvent('profile_image_pressed', { 
                      imageIndex: index,
                      profileId: profile.id 
                    });
                  }}
                />
              </View>
            )}

            {/* Profile Information */}
            <View style={styles.profileInfo}>
              {/* Name and Age */}
              <View style={styles.nameAgeRow}>
                <Typography variant="h2" style={styles.nameText}>
                  {profile.full_name || 'Unknown'}
                </Typography>
                <Typography variant="h3" style={styles.ageText}>
                  {age}
                </Typography>
              </View>

              {/* Location */}
              <View style={styles.locationRow}>
                <Ionicons 
                  name="location-outline" 
                  size={16} 
                  color={theme.colors.text.secondary}
                  style={styles.locationIcon}
                />
                <Typography variant="body" style={styles.locationText}>
                  {profile.lat && profile.lng ? 
                    `${formatDistance((profile as any).distance_km)} away` : 
                    t('discovery.locationUnknown')
                  }
                </Typography>
              </View>

              {/* Bio Section */}
              <View style={styles.section}>
                <Typography variant="h4" style={styles.sectionTitle}>
                  {t('profile.about')}
                </Typography>
                <Typography variant="body" style={styles.bioText}>
                  {profile.full_name ? 
                    t('discovery.profileBioPlaceholder').replace('{{name}}', profile.full_name.split(' ')[0]) :
                    t('discovery.profileBioDefault')
                  }
                </Typography>
              </View>

              {/* Sports Section */}
              <View style={styles.section}>
                <Typography variant="h4" style={styles.sectionTitle}>
                  {t('profile.sports')}
                </Typography>
                <View style={styles.sportsContainer}>
                  {((profile as any).user_sports || []).map((sport: string, index: number) => {
                    const isShared = ((profile as any).common_sports || []).includes(sport);
                    return (
                      <View 
                        key={index} 
                        style={[
                          styles.sportTag, 
                          isShared && styles.sharedSportTag
                        ]}
                      >
                        <Typography 
                          variant="caption" 
                          style={isShared ? 
                            {...styles.sportText, ...styles.sharedSportText} : 
                            styles.sportText
                          }
                        >
                          {sport}
                        </Typography>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Availability Section */}
              {availability.length > 0 && (
                <View style={styles.section}>
                  <Typography variant="h4" style={styles.sectionTitle}>
                    {t('profile.availability')}
                  </Typography>
                  <View style={styles.availabilityContainer}>
                    {formatAvailability(availability).map((slot, index) => (
                      <View key={index} style={styles.availabilityTag}>
                        <Typography variant="caption" style={styles.availabilityText}>
                          {slot}
                        </Typography>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Floating Action Buttons */}
          <View style={styles.floatingActions}>
            <NopeButton
              onPress={handleNope}
              disabled={isLoading}
              size="lg"
              style={styles.actionButton}
            />
            
            <RevertButton
              onPress={handleRevert}
              disabled={!canRevert || isLoading}
              size="lg"
              style={styles.actionButton}
            />
            
            <ChallengeButton
              onPress={handleChallenge}
              disabled={isLoading}
              size="lg"
              style={styles.actionButton}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
