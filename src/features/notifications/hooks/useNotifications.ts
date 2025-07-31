import { useEffect, useCallback } from 'react';
import { useNotificationsStore } from '../store/notifications.store';
import { NotificationType } from '../constants/notificationTypes';

export const useNotifications = () => {
  const {
    notifications,
    isLoading,
    lastFetch,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
    getNotificationsByType,
    clearAll,
    simulateNewNotification,
  } = useNotificationsStore();

  // Auto-fetch notifications on mount and when needed
  useEffect(() => {
    const shouldFetch = !lastFetch || (Date.now() - lastFetch > 5 * 60 * 1000); // 5 minutes
    if (shouldFetch) {
      fetchNotifications();
    }
  }, [lastFetch, fetchNotifications]);

  // Memoized handlers
  const handleNotificationPress = useCallback((notificationId: string) => {
    markAsRead(notificationId);
  }, [markAsRead]);

  const handleMarkAllRead = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const handleDeleteNotification = useCallback((notificationId: string) => {
    deleteNotification(notificationId);
  }, [deleteNotification]);

  const handleRefresh = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  const handleClearAll = useCallback(() => {
    clearAll();
  }, [clearAll]);

  // Helper to get notifications by type
  const getNotificationsByTypeCallback = useCallback((type: NotificationType) => {
    return getNotificationsByType(type);
  }, [getNotificationsByType]);

  // Get unread count
  const unreadCount = getUnreadCount();

  // Get recent notifications (last 24 hours)
  const recentNotifications = notifications.filter(
    notification => Date.now() - notification.timestamp < 24 * 60 * 60 * 1000
  );

  // Get today's notifications
  const todayNotifications = notifications.filter(notification => {
    const today = new Date();
    const notificationDate = new Date(notification.timestamp);
    return (
      today.getDate() === notificationDate.getDate() &&
      today.getMonth() === notificationDate.getMonth() &&
      today.getFullYear() === notificationDate.getFullYear()
    );
  });

  // Simulate new notification (for testing)
  const handleSimulateNotification = useCallback((type?: NotificationType) => {
    simulateNewNotification(type);
  }, [simulateNewNotification]);

  return {
    // Data
    notifications,
    isLoading,
    unreadCount,
    recentNotifications,
    todayNotifications,
    lastFetch,

    // Actions
    onNotificationPress: handleNotificationPress,
    onMarkAllRead: handleMarkAllRead,
    onDeleteNotification: handleDeleteNotification,
    onRefresh: handleRefresh,
    onClearAll: handleClearAll,
    getNotificationsByType: getNotificationsByTypeCallback,

    // Testing helpers
    onSimulateNotification: handleSimulateNotification,
  };
};

export default useNotifications;
