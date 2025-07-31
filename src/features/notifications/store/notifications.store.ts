import { create } from 'zustand';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { Notification, NotificationType } from '../constants/notificationTypes';
import { mockNotifications, generateMockNotification } from '../data/mockNotifications';

export interface NotificationsState {
  notifications: Notification[];
  isLoading: boolean;
  lastFetch: number | null;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  addNotification: (notification: Notification) => void;
  getUnreadCount: () => number;
  getNotificationsByType: (type: NotificationType) => Notification[];
  clearAll: () => void;
  
  // Real-time simulation helpers
  simulateNewNotification: (type?: NotificationType) => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  isLoading: false,
  lastFetch: null,

  fetchNotifications: async () => {
    const { isLoading } = get();
    if (isLoading) return;

    try {
      set({ isLoading: true });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be an API call
      // For now, we use mock data with fresh timestamps
      const freshNotifications = mockNotifications.map((notification, index) => ({
        ...notification,
        timestamp: Date.now() - (index * 1000 * 60 * 60 * 2) - (Math.random() * 1000 * 60 * 30),
      }));

      const sortedNotifications = freshNotifications.sort((a, b) => b.timestamp - a.timestamp);
      set({ 
        notifications: sortedNotifications,
        lastFetch: Date.now(),
      });

      logEvent(Events.SCREEN_VIEWED, {
        screenName: 'notifications',
        notificationCount: freshNotifications.length,
        unreadCount: freshNotifications.filter(n => !n.isRead).length,
      });

    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: (notificationId: string) => {
    const { notifications } = get();
    const notification = notifications.find(n => n.id === notificationId);
    
    if (!notification || notification.isRead) return;

    const updatedNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );

    set({ notifications: updatedNotifications });

    logEvent(Events.NOTIFICATION_PRESSED, {
      notificationId,
      notificationType: notification.type,
      wasRead: notification.isRead,
    });
  },

  markAllAsRead: () => {
    const { notifications } = get();
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    if (unreadCount === 0) return;

    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    set({ notifications: updatedNotifications });

    logEvent('notifications_mark_all_read', {
      previousUnreadCount: unreadCount,
    });
  },

  deleteNotification: (notificationId: string) => {
    const { notifications } = get();
    const notification = notifications.find(n => n.id === notificationId);
    
    if (!notification) return;

    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    set({ notifications: updatedNotifications });

    logEvent('notification_deleted', {
      notificationId,
      notificationType: notification.type,
      wasRead: notification.isRead,
    });
  },

  addNotification: (notification: Notification) => {
    const { notifications } = get();
    const updatedNotifications = [notification, ...notifications];
    set({ notifications: updatedNotifications });

    logEvent('notification_received', {
      notificationId: notification.id,
      notificationType: notification.type,
    });
  },

  getUnreadCount: () => {
    const { notifications } = get();
    return notifications.filter(n => !n.isRead).length;
  },

  getNotificationsByType: (type: NotificationType) => {
    const { notifications } = get();
    return notifications.filter(n => n.type === type);
  },

  clearAll: () => {
    const { notifications } = get();
    const notificationCount = notifications.length;
    
    set({ notifications: [], lastFetch: null });

    logEvent('notifications_cleared', {
      clearedCount: notificationCount,
    });
  },

  simulateNewNotification: (type?: NotificationType) => {
    const { addNotification } = get();
    const newNotification = generateMockNotification(type);
    addNotification(newNotification);

    logEvent('notification_simulated', {
      notificationType: newNotification.type,
    });
  },
}));
