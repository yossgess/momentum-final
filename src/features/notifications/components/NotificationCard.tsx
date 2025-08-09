import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// Using a simple time formatting function instead of date-fns for now
// import { formatDistanceToNow } from 'date-fns';
// import { enUS, fr } from 'date-fns/locale';
// Using Expo Vector Icons instead of lucide-react-native
import { Ionicons } from '@expo/vector-icons';
import { Notification, NOTIFICATION_ICONS } from '../constants/notificationTypes';
import { t, i18n } from '../../../shared/utils/i18n';
import { logEvent } from '../../../shared/utils/analytics';

interface NotificationCardProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
  onDelete?: (notificationId: string) => void;
}

const getNotificationIcon = (type: Notification['type'], size: number = 24, color: string = '#00A89D') => {
  switch (type) {
    case 'match':
      return <Ionicons name="flash" size={size} color={color} />;
    case 'message':
      return <Ionicons name="chatbubble" size={size} color={color} />;
    case 'event-invite':
      return <Ionicons name="calendar" size={size} color={color} />;
    case 'event-update':
      return <Ionicons name="calendar-outline" size={size} color={color} />;
    case 'profile-view':
      return <Ionicons name="eye" size={size} color={color} />;
    case 'challenge-received':
      return <Ionicons name="trophy" size={size} color={color} />;
    default:
      return <Ionicons name="person" size={size} color={color} />;
  }
};

const getNotificationTitle = (notification: Notification): string => {
  switch (notification.type) {
    case 'match':
      return t('notifications.matchTitle', 'New Match!');
    case 'message':
      return t('notifications.messageTitle', 'New Message');
    case 'event-invite':
      return t('notifications.eventInviteTitle', 'Event Invitation');
    case 'event-update':
      return t('notifications.eventUpdateTitle', 'Event Update');
    case 'profile-view':
      return t('notifications.profileViewTitle', 'Profile View');
    case 'challenge-received':
      return t('notifications.challengeTitle', 'Challenge Received');
    default:
      return t('notifications.defaultTitle', 'Notification');
  }
};

const getNotificationSubtitle = (notification: Notification): string => {
  switch (notification.type) {
    case 'match':
      const matchNotification = notification as Notification<'match'>;
      const userName = matchNotification.data.user || 'Someone';
      return `You have a new challenge with ${userName}!`;
    
    case 'message':
      const messageData = notification.data as any;
      return t('notifications.messageSubtitle', `${messageData.sender}: ${messageData.preview || 'New message'}`);
    
    case 'event-invite':
      const eventInviteData = notification.data as any;
      return t('notifications.eventInviteSubtitle', `${eventInviteData.inviterName || 'Someone'} invited you to ${eventInviteData.eventName}`);
    
    case 'event-update':
      const eventUpdateData = notification.data as any;
      const updateTypeText = eventUpdateData.updateType === 'cancelled' 
        ? t('notifications.eventCancelled', 'cancelled')
        : eventUpdateData.updateType === 'rescheduled'
        ? t('notifications.eventRescheduled', 'rescheduled')
        : t('notifications.eventUpdated', 'updated');
      return t('notifications.eventUpdateSubtitle', `${eventUpdateData.eventName} has been ${updateTypeText}`);
    
    case 'profile-view':
      const profileViewData = notification.data as any;
      return t('notifications.profileViewSubtitle', `${profileViewData.viewer} viewed your profile`);
    
    case 'challenge-received':
      const challengeData = notification.data as any;
      return t('notifications.challengeSubtitle', `${challengeData.challenger} challenged you${challengeData.sport ? ` to ${challengeData.sport}` : ''}`);
    
    default:
      return t('notifications.defaultSubtitle', 'You have a new notification');
  }
};

const getIconColor = (type: Notification['type'], isRead: boolean): string => {
  if (isRead) return '#6B6E75'; // theme.colors.text.tertiary
  
  switch (type) {
    case 'match':
    case 'challenge-received':
      return '#00A89D'; // theme.colors.primary.main
    case 'message':
      return '#A9EAE7'; // theme.colors.accent.main
    case 'event-invite':
      return '#00A89D'; // theme.colors.status.info
    case 'event-update':
      return '#FF9100'; // theme.colors.status.warning
    case 'profile-view':
      return '#A4A6AC'; // theme.colors.text.secondary
    default:
      return '#00A89D';
  }
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
  onDelete,
}) => {
  const handlePress = () => {
    logEvent('notification_pressed', {
      notificationId: notification.id,
      notificationType: notification.type,
      wasRead: notification.isRead,
    });
    
    onPress(notification);
  };

  const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    const isEnglish = i18n.getCurrentLanguage() === 'en';
    
    if (minutes < 1) {
      return isEnglish ? 'just now' : 'à l\'instant';
    } else if (minutes < 60) {
      return isEnglish ? `${minutes}m ago` : `il y a ${minutes}m`;
    } else if (hours < 24) {
      return isEnglish ? `${hours}h ago` : `il y a ${hours}h`;
    } else {
      return isEnglish ? `${days}d ago` : `il y a ${days}j`;
    }
  };

  const iconColor = getIconColor(notification.type, notification.isRead);
  const title = getNotificationTitle(notification);
  const subtitle = getNotificationSubtitle(notification);
  const timeAgo = formatTimestamp(notification.timestamp);

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        !notification.isRead && styles.unreadContainer
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Unread indicator */}
      {!notification.isRead && <View style={styles.unreadIndicator} />}
      
      {/* Icon */}
      <View style={[styles.iconContainer, !notification.isRead && styles.unreadIconContainer]}>
        {getNotificationIcon(notification.type, 24, iconColor)}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, !notification.isRead && styles.unreadTitle]} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.timestamp}>{timeAgo}</Text>
        </View>
        
        <Text style={[styles.subtitle, !notification.isRead && styles.unreadSubtitle]} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>

      {/* Arrow icon */}
      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={16} color="#6B6E75" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1C1E22', // theme.colors.surface.primary
    borderBottomWidth: 1,
    borderBottomColor: '#2A2D33', // theme.colors.border.primary
    position: 'relative',
  },
  unreadContainer: {
    backgroundColor: '#2A2D33', // theme.colors.surface.secondary
  },
  unreadIndicator: {
    position: 'absolute',
    left: 8,
    top: '50%',
    marginTop: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00A89D', // theme.colors.primary.main
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3A3D44', // theme.colors.surface.tertiary
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  unreadIconContainer: {
    backgroundColor: '#00A89D20', // theme.colors.primary.main with opacity
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A4A6AC', // theme.colors.text.secondary
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    color: '#FFFFFF', // theme.colors.text.primary
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6E75', // theme.colors.text.tertiary
    lineHeight: 20,
  },
  unreadSubtitle: {
    color: '#A4A6AC', // theme.colors.text.secondary
  },
  timestamp: {
    fontSize: 12,
    color: '#6B6E75', // theme.colors.text.tertiary
    fontWeight: '400',
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4,
  },
});

export default NotificationCard;
