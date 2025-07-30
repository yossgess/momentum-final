import React from 'react';
import { View, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../atoms/Typography';
import { CourtCardProps } from './CourtCard.types';
import { styles } from './CourtCard.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const CourtCard: React.FC<CourtCardProps> = ({
  court,
  onPress,
  style,
}) => {
  const handlePress = () => {
    logEvent(Events.CARD_PRESSED, { type: 'court', courtId: court.id });
    onPress(court.id);
  };

  return (
    <Pressable style={[styles.container, style]} onPress={handlePress}>
      <Image
        source={court.image ? { uri: court.image } : undefined}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Typography variant="body" color="primary" weight="semibold" numberOfLines={1}>
          {court.courtName}
        </Typography>
        
        <View style={styles.details}>
          <View style={styles.typeChip}>
            <Typography variant="caption" color={theme.colors.primary.main}>
              {court.type}
            </Typography>
          </View>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={theme.colors.text.secondary} />
            <Typography variant="caption" color="secondary" style={styles.locationText} numberOfLines={1}>
              {court.location}
            </Typography>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
