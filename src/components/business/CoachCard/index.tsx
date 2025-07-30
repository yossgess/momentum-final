import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../atoms/Typography';
import { Avatar } from '../../atoms/Avatar';
import { CoachCardProps } from './CoachCard.types';
import { styles } from './CoachCard.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const CoachCard: React.FC<CoachCardProps> = ({
  coach,
  onPress,
  style,
}) => {
  const handlePress = () => {
    logEvent(Events.CARD_PRESSED, { type: 'coach', coachId: coach.id });
    onPress(coach.id);
  };

  const renderStars = (rating: number) => {
    const stars: React.ReactElement[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={12} color={theme.colors.status.warning} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={12} color={theme.colors.status.warning} />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={12} color={theme.colors.text.tertiary} />
      );
    }

    return stars;
  };

  return (
    <Pressable style={[styles.container, style]} onPress={handlePress}>
      <Avatar
        source={coach.avatarImage ? { uri: coach.avatarImage } : undefined}
        initials={coach.name.split(' ').map(n => n[0]).join('')}
        size="lg"
      />
      
      <View style={styles.content}>
        <Typography variant="body" color="primary" weight="semibold" numberOfLines={1}>
          {coach.name}
        </Typography>
        
        <Typography variant="caption" color="secondary" numberOfLines={1} style={styles.specialty}>
          {coach.specialty}
        </Typography>
        
        <View style={styles.rating}>
          <View style={styles.stars}>
            {renderStars(coach.rating)}
          </View>
          <Typography variant="caption" color="tertiary" style={styles.ratingText}>
            {coach.rating.toFixed(1)}
          </Typography>
        </View>
        
        {coach.available && (
          <View style={styles.availableBadge}>
            <View style={styles.availableDot} />
            <Typography variant="caption" color={theme.colors.status.success}>
              Available
            </Typography>
          </View>
        )}
      </View>
    </Pressable>
  );
};
