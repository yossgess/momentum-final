import React from 'react';
import { View, Pressable, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../atoms/Typography';
import { CommonSportsDisplay } from '../CommonSportsDisplay';
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
  const handleImagePress = (imageIndex: number) => {
    logEvent(Events.PROFILE_VIEWED, { profileId: profile.id, imageIndex });
    onPressImage?.(imageIndex);
  };

  return (
    <View style={[
      fullScreen ? styles.fullScreenContainer : styles.container, 
      style
    ]}>
      {/* Full-screen image carousel */}
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        style={styles.fullCarousel}
      >
        {profile.images.map((image, index) => (
          <Pressable
            key={index}
            onPress={() => handleImagePress(index)}
            style={styles.imageContainer}
          >
            <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
          </Pressable>
        ))}
      </ScrollView>

      {/* Image indicators */}
      <View style={styles.imageIndicators}>
        {profile.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === 0 && styles.activeIndicator,
            ]}
          />
        ))}
      </View>

      {/* Single consolidated text container at bottom left */}
      <View style={styles.bottomLeftContainer}>
        <Typography variant="h2" color="primary" weight="bold" style={styles.nameText}>
          {profile.name}, {profile.age}
        </Typography>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color={theme.colors.text.primary} />
          <Typography variant="body" color="primary" style={styles.locationText}>
            {profile.location}
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
