import React from 'react';
import { View, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../atoms/Typography';
import { EventCardProps } from './EventCard.types';
import { styles } from './EventCard.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  style,
}) => {
  const handlePress = () => {
    logEvent(Events.CARD_PRESSED, { type: 'event', eventId: event.id });
    onPress(event.id);
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Pressable style={[styles.container, style]} onPress={handlePress}>
      <Image
        source={event.image ? { uri: event.image } : require('../../../assets/placeholder-event.png')}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Typography variant="body" color="primary" weight="semibold" numberOfLines={2}>
          {event.title}
        </Typography>
        
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={14} color={theme.colors.text.secondary} />
            <Typography variant="caption" color="secondary" style={styles.detailText}>
              {formatDateTime(event.dateTime)}
            </Typography>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={14} color={theme.colors.text.secondary} />
            <Typography variant="caption" color="secondary" style={styles.detailText} numberOfLines={1}>
              {event.location}
            </Typography>
          </View>
        </View>
        
        <View style={styles.footer}>
          {event.sportType && (
            <View style={styles.sportChip}>
              <Ionicons name="fitness-outline" size={12} color={theme.colors.primary.main} />
              <Typography variant="caption" color={theme.colors.primary.main} style={styles.sportText}>
                {event.sportType}
              </Typography>
            </View>
          )}
          
          {event.participants && (
            <Typography variant="caption" color="tertiary">
              {event.participants.current}/{event.participants.max}
            </Typography>
          )}
        </View>
      </View>
    </Pressable>
  );
};
