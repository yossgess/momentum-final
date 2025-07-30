export interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

export interface UserProperties {
  userId?: string;
  userType?: 'enthusiast' | 'coach';
  age?: number;
  gender?: string;
  location?: string;
  sportsInterests?: string[];
  skillLevels?: Record<string, string>;
}

class AnalyticsService {
  private userProperties: UserProperties = {};
  private isEnabled: boolean = true;

  setUserProperties(properties: UserProperties) {
    this.userProperties = { ...this.userProperties, ...properties };
    console.log('Analytics: User properties updated', this.userProperties);
  }

  setUserId(userId: string) {
    this.userProperties.userId = userId;
    console.log('Analytics: User ID set', userId);
  }

  logEvent(eventName: string, properties?: EventProperties) {
    if (!this.isEnabled) return;

    const eventData = {
      event: eventName,
      timestamp: new Date().toISOString(),
      userProperties: this.userProperties,
      properties: properties || {},
    };

    console.log('Analytics Event:', eventData);

  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  reset() {
    this.userProperties = {};
    console.log('Analytics: User properties reset');
  }
}

export const analytics = new AnalyticsService();

export const logEvent = (eventName: string, properties?: EventProperties) => {
  analytics.logEvent(eventName, properties);
};

export const Events = {
  APP_OPENED: 'app_opened',
  APP_BACKGROUNDED: 'app_backgrounded',
  
  LOGIN_ATTEMPTED: 'login_attempted',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  SIGNUP_ATTEMPTED: 'signup_attempted',
  SIGNUP_SUCCESS: 'signup_success',
  SIGNUP_FAILED: 'signup_failed',
  LOGOUT: 'logout',
  
  PROFILE_VIEWED: 'profile_viewed',
  PROFILE_EDITED: 'profile_edited',
  PROFILE_PHOTO_UPLOADED: 'profile_photo_uploaded',
  
  PROFILE_SWIPED_RIGHT: 'profile_swiped_right',
  PROFILE_SWIPED_LEFT: 'profile_swiped_left',
  PROFILE_SUPER_LIKED: 'profile_super_liked',
  MATCH_CREATED: 'match_created',
  MATCH_MODAL_VIEWED: 'match_modal_viewed',
  
  EVENT_VIEWED: 'event_viewed',
  EVENT_CREATED: 'event_created',
  EVENT_JOINED: 'event_joined',
  EVENT_LEFT: 'event_left',
  EVENT_SHARED: 'event_shared',
  
  CHAT_OPENED: 'chat_opened',
  MESSAGE_SENT: 'message_sent',
  MESSAGE_RECEIVED: 'message_received',
  
  SCREEN_VIEWED: 'screen_viewed',
  TAB_SWITCHED: 'tab_switched',
  
  SEARCH_PERFORMED: 'search_performed',
  FILTER_APPLIED: 'filter_applied',
  
  COACH_VIEWED: 'coach_viewed',
  COACH_CONTACTED: 'coach_contacted',
  COURT_VIEWED: 'court_viewed',
  COURT_BOOKED: 'court_booked',
} as const;
