import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationCard } from './components/NotificationCard';
import { useNotifications } from './hooks/useNotifications';
import { Notification } from './constants/notificationTypes';
import { t } from '../../shared/utils/i18n';
import { logEvent } from '../../shared/utils/analytics';
import { theme } from '../../theme';

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    notifications,
    isLoading,
    unreadCount,
    onNotificationPress,
    onMarkAllRead,
    onDeleteNotification,
    onRefresh,
    onClearAll,
    onSimulateNotification, // For testing
  } = useNotifications();

  // Auto-mark all notifications as read when screen opens (optional feature)
  React.useEffect(() => {
    if (unreadCount > 0) {
      // Delay to allow screen transition to complete
      const timer = setTimeout(() => {
        onMarkAllRead();
        logEvent('notifications_auto_marked_read', {
          unreadCount,
          screenName: 'notifications',
        });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []); // Only run on mount

  const handleBackPress = useCallback(() => {
    logEvent('button_pressed', {
      buttonName: 'back',
      screenName: 'notifications',
    });
    navigation.goBack();
  }, [navigation]);

  const handleNotificationPress = useCallback((notification: Notification) => {
    onNotificationPress(notification.id);
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'match':
        // Navigate to match modal or discovery screen
        logEvent('navigation', {
          from: 'notifications',
          to: 'discovery',
          trigger: 'match_notification',
        });
        // navigation.navigate('Discovery');
        break;
        
      case 'message':
        // Navigate to chat screen
        const messageData = notification.data as any;
        logEvent('navigation', {
          from: 'notifications',
          to: 'chat',
          trigger: 'message_notification',
          chatId: messageData.chatId,
        });
        // navigation.navigate('Chat', { chatId: messageData.chatId });
        break;
        
      case 'event-invite':
      case 'event-update':
        // Navigate to events screen
        const eventData = notification.data as any;
        logEvent('navigation', {
          from: 'notifications',
          to: 'events',
          trigger: 'event_notification',
          eventId: eventData.eventId,
        });
        // navigation.navigate('Events', { eventId: eventData.eventId });
        break;
        
      case 'profile-view':
        // Navigate to profile or discovery screen
        logEvent('navigation', {
          from: 'notifications',
          to: 'profile',
          trigger: 'profile_view_notification',
        });
        // navigation.navigate('Profile');
        break;
        
      case 'challenge-received':
        // Navigate to discovery or match zone
        logEvent('navigation', {
          from: 'notifications',
          to: 'matchzone',
          trigger: 'challenge_notification',
        });
        // navigation.navigate('MatchZone');
        break;
        
      default:
        console.log('Unknown notification type:', notification.type);
    }
  }, [onNotificationPress]);

  const handleMarkAllRead = useCallback(() => {
    if (unreadCount === 0) return;
    
    Alert.alert(
      t('notifications.markAllReadTitle', 'Mark All as Read'),
      t('notifications.markAllReadMessage', 'Are you sure you want to mark all notifications as read?'),
      [
        {
          text: t('common.cancel', 'Cancel'),
          style: 'cancel',
        },
        {
          text: t('notifications.markAllRead', 'Mark All Read'),
          onPress: () => {
            onMarkAllRead();
            logEvent('notifications_mark_all_read', {
              previousUnreadCount: unreadCount,
            });
          },
        },
      ]
    );
  }, [onMarkAllRead, unreadCount]);

  const handleClearAll = useCallback(() => {
    if (notifications.length === 0) return;
    
    Alert.alert(
      t('notifications.clearAllTitle', 'Clear All Notifications'),
      t('notifications.clearAllMessage', 'This will permanently delete all notifications. This action cannot be undone.'),
      [
        {
          text: t('common.cancel', 'Cancel'),
          style: 'cancel',
        },
        {
          text: t('notifications.clearAll', 'Clear All'),
          style: 'destructive',
          onPress: () => {
            onClearAll();
            logEvent('notifications_cleared', {
              clearedCount: notifications.length,
            });
          },
        },
      ]
    );
  }, [onClearAll, notifications.length]);

  const handleOptionsPress = useCallback(() => {
    Alert.alert(
      t('notifications.options', 'Notification Options'),
      '',
      [
        ...(unreadCount > 0 ? [{
          text: t('notifications.markAllRead', 'Mark All as Read'),
          onPress: handleMarkAllRead,
        }] : []),
        ...(notifications.length > 0 ? [{
          text: t('notifications.clearAll', 'Clear All'),
          style: 'destructive' as const,
          onPress: handleClearAll,
        }] : []),
        {
          text: t('notifications.simulateNew', 'Add Test Notification'),
          onPress: () => onSimulateNotification(),
        },
        {
          text: t('common.cancel', 'Cancel'),
          style: 'cancel',
        },
      ]
    );
  }, [handleMarkAllRead, handleClearAll, onSimulateNotification, unreadCount, notifications.length]);

  const renderNotificationItem = useCallback(({ item }: { item: Notification }) => (
    <NotificationCard
      notification={item}
      onPress={handleNotificationPress}
      onDelete={onDeleteNotification}
    />
  ), [handleNotificationPress, onDeleteNotification]);

  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="notifications-off" size={64} color={theme.colors.text.tertiary} />
      </View>
      <Text style={styles.emptyTitle}>
        {t('notifications.empty', 'No notifications yet')}
      </Text>
      <Text style={styles.emptySubtitle}>
        {t('notifications.emptyMessage', 'When you get matches, messages, or event invites, they\'ll appear here.')}
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => onSimulateNotification()}
      >
        <Text style={styles.emptyButtonText}>
          {t('notifications.addTest', 'Add Test Notification')}
        </Text>
      </TouchableOpacity>
    </View>
  ), [onSimulateNotification]);

  const keyExtractor = useCallback((item: Notification) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {t('screens.notifications', 'Notifications')}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.optionsButton}
          onPress={handleOptionsPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary.main}
            colors={[theme.colors.primary.main]}
          />
        }
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={notifications.length === 0 ? styles.emptyListContainer : undefined}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  badge: {
    backgroundColor: theme.colors.status.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: theme.colors.text.inverse,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 6,
  },
  optionsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border.primary,
    marginLeft: 68, // Align with content after icon
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surface.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotificationsScreen;
