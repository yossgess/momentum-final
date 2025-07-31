import { Notification } from '../constants/notificationTypes';

export const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    type: 'match',
    isRead: false,
    timestamp: Date.now() - 1000 * 60 * 3, // 3 minutes ago
    data: {
      user: 'Sofia',
      userId: 'user_sofia_123',
      userPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      commonSports: ['Tennis', 'Padel'],
    }
  },
  {
    id: 'notif2',
    type: 'event-invite',
    isRead: false,
    timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
    data: {
      eventName: 'Padel Sunday Match',
      eventId: 'event_123',
      inviterName: 'Marcus',
      eventDate: '2025-08-03T10:00:00Z',
      eventLocation: 'Central Sports Club',
    }
  },
  {
    id: 'notif3',
    type: 'message',
    isRead: false,
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    data: {
      sender: 'Emma',
      senderId: 'user_emma_456',
      senderPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      preview: 'Hey! Are you free for tennis tomorrow?',
      chatId: 'chat_emma_123',
    }
  },
  {
    id: 'notif4',
    type: 'challenge-received',
    isRead: true,
    timestamp: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago
    data: {
      challenger: 'Alex',
      challengerId: 'user_alex_789',
      challengerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      sport: 'Basketball',
    }
  },
  {
    id: 'notif5',
    type: 'profile-view',
    isRead: true,
    timestamp: Date.now() - 1000 * 60 * 60 * 6, // 6 hours ago
    data: {
      viewer: 'Liam',
      viewerId: 'user_liam_101',
      viewerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    }
  },
  {
    id: 'notif6',
    type: 'event-update',
    isRead: true,
    timestamp: Date.now() - 1000 * 60 * 60 * 8, // 8 hours ago
    data: {
      eventName: 'Weekly Football Match',
      eventId: 'event_456',
      updateType: 'rescheduled',
      newDate: '2025-08-04T15:00:00Z',
    }
  },
  {
    id: 'notif7',
    type: 'match',
    isRead: true,
    timestamp: Date.now() - 1000 * 60 * 60 * 12, // 12 hours ago
    data: {
      user: 'Zoe',
      userId: 'user_zoe_202',
      userPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      commonSports: ['Yoga', 'Pilates'],
    }
  },
  {
    id: 'notif8',
    type: 'message',
    isRead: true,
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    data: {
      sender: 'Oliver',
      senderId: 'user_oliver_303',
      senderPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      preview: 'Great match yesterday! Same time next week?',
      chatId: 'chat_oliver_123',
    }
  },
  {
    id: 'notif9',
    type: 'event-invite',
    isRead: true,
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    data: {
      eventName: 'Morning Yoga Session',
      eventId: 'event_789',
      inviterName: 'Maya',
      eventDate: '2025-08-05T07:00:00Z',
      eventLocation: 'Zen Studio',
    }
  },
  {
    id: 'notif10',
    type: 'profile-view',
    isRead: true,
    timestamp: Date.now() - 1000 * 60 * 60 * 72, // 3 days ago
    data: {
      viewer: 'Noah',
      viewerId: 'user_noah_404',
      viewerPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    }
  },
];

// Helper function to get fresh mock data with recent timestamps
export const getFreshMockNotifications = (): Notification[] => {
  const now = Date.now();
  
  return mockNotifications.map((notification, index) => ({
    ...notification,
    // Spread notifications over the last 3 days with some recent ones
    timestamp: now - (index * 1000 * 60 * 60 * 3) - (Math.random() * 1000 * 60 * 30),
  }));
};

// Helper to generate a new notification (useful for testing real-time updates)
export const generateMockNotification = (type?: Notification['type']): Notification => {
  const types: Notification['type'][] = ['match', 'message', 'event-invite', 'event-update', 'profile-view', 'challenge-received'];
  const selectedType = type || types[Math.floor(Math.random() * types.length)];
  
  const baseNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: selectedType,
    isRead: false,
    timestamp: Date.now(),
  };

  switch (selectedType) {
    case 'match':
      return {
        ...baseNotification,
        type: 'match',
        data: {
          user: 'New Match',
          userId: `user_${Math.random().toString(36).substr(2, 9)}`,
          userPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          commonSports: ['Tennis'],
        }
      };
    
    case 'message':
      return {
        ...baseNotification,
        type: 'message',
        data: {
          sender: 'Someone',
          senderId: `user_${Math.random().toString(36).substr(2, 9)}`,
          senderPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          preview: 'Hey! How are you?',
          chatId: `chat_${Math.random().toString(36).substr(2, 9)}`,
        }
      };
    
    case 'event-invite':
      return {
        ...baseNotification,
        type: 'event-invite',
        data: {
          eventName: 'New Event',
          eventId: `event_${Math.random().toString(36).substr(2, 9)}`,
          inviterName: 'Friend',
          eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          eventLocation: 'Sports Center',
        }
      };
    
    case 'event-update':
      return {
        ...baseNotification,
        type: 'event-update',
        data: {
          eventName: 'Updated Event',
          eventId: `event_${Math.random().toString(36).substr(2, 9)}`,
          updateType: 'rescheduled',
          newDate: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
        }
      };
    
    case 'profile-view':
      return {
        ...baseNotification,
        type: 'profile-view',
        data: {
          viewer: 'Profile Viewer',
          viewerId: `user_${Math.random().toString(36).substr(2, 9)}`,
          viewerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        }
      };
    
    case 'challenge-received':
      return {
        ...baseNotification,
        type: 'challenge-received',
        data: {
          challenger: 'Challenger',
          challengerId: `user_${Math.random().toString(36).substr(2, 9)}`,
          challengerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          sport: 'Tennis',
        }
      };
    
    default:
      throw new Error(`Unknown notification type: ${selectedType}`);
  }
};
