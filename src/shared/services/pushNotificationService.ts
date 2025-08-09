import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { logEvent } from '../utils/analytics';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface PushNotificationData {
  type: 'match' | 'message' | 'challenge';
  userId?: string;
  userName?: string;
  matchId?: string;
  [key: string]: any;
}

class PushNotificationService {
  private expoPushToken: string | null = null;

  /**
   * Initialize push notifications
   * Request permissions and get push token
   */
  async initialize(): Promise<boolean> {
    try {
      // Check if device supports push notifications
      if (!Device.isDevice) {
        console.log('Push notifications only work on physical devices');
        return false;
      }

      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Push notification permission denied');
        return false;
      }

      // Get push token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID || 'your-project-id',
      });

      this.expoPushToken = token.data;
      console.log('Push token:', this.expoPushToken);

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('match-notifications', {
          name: 'Match Notifications',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      logEvent('push_notifications_initialized', {
        hasToken: !!this.expoPushToken,
        platform: Platform.OS,
      });

      return true;
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return false;
    }
  }

  /**
   * Send a local push notification for a new match
   */
  async sendMatchNotification(matchedUserName: string, matchId: string): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'New Challenge',
          body: `You have a new challenge with ${matchedUserName}`,
          data: {
            type: 'match',
            matchId,
            userName: matchedUserName,
          } as PushNotificationData,
          sound: 'default',
          badge: await this.getBadgeCount() + 1,
        },
        trigger: null, // Send immediately
      });

      logEvent('push_notification_sent', {
        type: 'match',
        matchId,
        userName: matchedUserName,
      });

      console.log(`📱 Push notification sent: New challenge with ${matchedUserName}`);
    } catch (error) {
      console.error('Error sending match notification:', error);
    }
  }

  /**
   * Send a local push notification for a new message
   */
  async sendMessageNotification(senderName: string, messagePreview: string, chatId: string): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Message from ${senderName}`,
          body: messagePreview,
          data: {
            type: 'message',
            chatId,
            userName: senderName,
          } as PushNotificationData,
          sound: 'default',
          badge: await this.getBadgeCount() + 1,
        },
        trigger: null, // Send immediately
      });

      logEvent('push_notification_sent', {
        type: 'message',
        chatId,
        senderName,
      });

      console.log(`📱 Push notification sent: Message from ${senderName}`);
    } catch (error) {
      console.error('Error sending message notification:', error);
    }
  }

  /**
   * Get current badge count
   */
  private async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Error getting badge count:', error);
      return 0;
    }
  }

  /**
   * Set badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
      await this.setBadgeCount(0);
      
      logEvent('push_notifications_cleared', {});
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }

  /**
   * Get push token
   */
  getPushToken(): string | null {
    return this.expoPushToken;
  }

  /**
   * Handle notification received while app is in foreground
   */
  addNotificationReceivedListener(callback: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  /**
   * Handle notification tapped/opened
   */
  addNotificationResponseReceivedListener(callback: (response: Notifications.NotificationResponse) => void) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService();

// Export Notifications from expo-notifications
export { Notifications };
