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
}) => {
  const handleImagePress = (imageIndex: number) => {
    logEvent(Events.PROFILE_VIEWED, { profileId: profile.id, imageIndex });
    onPressImage?.(imageIndex);
  };

  const handleSwipeLeft = () => {
    logEvent(Events.PROFILE_SWIPED_LEFT, { profileId: profile.id });
    onSwipeLeft();
  };

  const handleSwipeRight = () => {
    logEvent(Events.PROFILE_SWIPED_RIGHT, { profileId: profile.id });
    onSwipeRight();
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        style={styles.imageCarousel}
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

      <View style={styles.content}>
        <View style={styles.header}>
          <Typography variant="h2" color="primary" weight="bold">
            {profile.name}, {profile.age}
          </Typography>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={theme.colors.text.secondary} />
            <Typography variant="body" color="secondary" style={styles.locationText}>
              {profile.location}
            </Typography>
          </View>
        </View>

        {profile.bio && (
          <Typography variant="body" color="secondary" style={styles.bio} numberOfLines={3}>
            {profile.bio}
          </Typography>
        )}

        <CommonSportsDisplay
          sharedSports={profile.sharedSports || []}
          userSports={profile.sports || []}
          showTitle={false}
          style={styles.sports}
        />

        <View style={styles.actions}>
          <Pressable style={styles.nopeButton} onPress={handleSwipeLeft}>
            <Ionicons name="close" size={24} color={theme.colors.status.error} />
          </Pressable>
          
          <Pressable style={styles.likeButton} onPress={handleSwipeRight}>
            <Ionicons name="heart" size={24} color={theme.colors.status.success} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};
