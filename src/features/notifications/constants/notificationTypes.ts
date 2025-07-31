export type NotificationType = 
  | 'match'          // New match (Challenge Accepted)
  | 'message'        // New message received
  | 'event-invite'   // Invited to join a sport event
  | 'event-update'   // Event cancelled or updated
  | 'profile-view'   // Someone viewed your profile
  | 'challenge-received'; // Someone challenged you

export interface NotificationData {
  match: {
    user: string;
    userId?: string;
    userPhoto?: string;
    commonSports?: string[];
  };
  message: {
    sender: string;
    senderId?: string;
    senderPhoto?: string;
    preview?: string;
    chatId?: string;
  };
  'event-invite': {
    eventName: string;
    eventId?: string;
    inviterName?: string;
    eventDate?: string;
    eventLocation?: string;
  };
  'event-update': {
    eventName: string;
    eventId?: string;
    updateType: 'cancelled' | 'rescheduled' | 'location_changed';
    newDate?: string;
    newLocation?: string;
  };
  'profile-view': {
    viewer: string;
    viewerId?: string;
    viewerPhoto?: string;
  };
  'challenge-received': {
    challenger: string;
    challengerId?: string;
    challengerPhoto?: string;
    sport?: string;
  };
}

export interface BaseNotification {
  id: string;
  type: NotificationType;
  isRead: boolean;
  timestamp: number;
  createdAt?: string;
}

export interface Notification<T extends NotificationType = NotificationType> extends BaseNotification {
  type: T;
  data: NotificationData[T];
}

export const NOTIFICATION_ICONS = {
  match: 'zap',
  message: 'message-circle',
  'event-invite': 'calendar-plus',
  'event-update': 'calendar-x',
  'profile-view': 'eye',
  'challenge-received': 'target',
} as const;

export const NOTIFICATION_COLORS = {
  match: 'primary',
  message: 'accent',
  'event-invite': 'status.info',
  'event-update': 'status.warning',
  'profile-view': 'secondary',
  'challenge-received': 'primary',
} as const;
