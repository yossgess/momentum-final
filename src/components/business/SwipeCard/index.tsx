import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../atoms/Typography';
import { CommonSportsDisplay } from '../CommonSportsDisplay';
import { ImageCarousel } from '../ImageCarousel';
import { SwipeCardProps } from './SwipeCard.types';
import { styles } from './SwipeCard.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onSwipeLeft,
  onSwipeRight,
  onPressImage,
  style,
  fullScreen = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleImagePress = (imageIndex: number) => {
    logEvent(Events.PROFILE_VIEWED, { profileId: profile.id, imageIndex });
    onPressImage?.(imageIndex);
  };

  const handleIndexChange = (newIndex: number) => {
    setActiveIndex(newIndex);
  };

  return (
    <View style={[
      fullScreen ? styles.fullScreenContainer : styles.container, 
      style
    ]}>
      {/* Full-screen image carousel */}
      <ImageCarousel
        images={profile.images}
        onImagePress={handleImagePress}
        onIndexChange={handleIndexChange}
        style={styles.fullCarousel}
      />

      {/* Single consolidated text container at bottom left */}
      <View style={styles.bottomLeftContainer}>
        <Typography variant="h2" color="primary" weight="bold" style={styles.nameText}>
          {profile.name}, {profile.age}
        </Typography>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color={theme.colors.text.primary} />
          <Typography variant="body" color="primary" style={styles.locationText}>
            {profile.distanceInKm ? 
              `${profile.distanceInKm.toFixed(1)} km away` : 
              profile.location || 'Location unknown'
            }
          </Typography>
        </View>

        <CommonSportsDisplay
          sharedSports={profile.sharedSports || []}
          userSports={profile.sports || []}
          showTitle={false}
          style={styles.sports}
        />
      </View>
    </View>
  );
};
