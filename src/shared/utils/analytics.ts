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
  
  BUTTON_PRESSED: 'button_pressed',
  INPUT_FOCUSED: 'input_focused',
  INPUT_CHANGED: 'input_changed',
  PASSWORD_VISIBILITY_TOGGLED: 'password_visibility_toggled',
  ICON_BADGE_PRESSED: 'icon_badge_pressed',
  SECTION_SELECTED: 'section_selected',
  SWITCH_TOGGLED: 'switch_toggled',
  TAG_PRESSED: 'tag_pressed',
  TAG_CLOSED: 'tag_closed',
  AVATAR_PRESSED: 'avatar_pressed',
  LOADER_SHOWN: 'loader_shown',
  LOADER_HIDDEN: 'loader_hidden',
  MODAL_OPENED: 'modal_opened',
  MODAL_CLOSED: 'modal_closed',
  TOAST_SHOWN: 'toast_shown',
  SPORT_SELECTED: 'sport_selected',
  SPORT_DESELECTED: 'sport_deselected',
  SKILL_LEVEL_CHANGED: 'skill_level_changed',
  AGE_RANGE_CHANGED: 'age_range_changed',
  DISTANCE_RANGE_CHANGED: 'distance_range_changed',
  CARD_PRESSED: 'card_pressed',
  NOTIFICATION_PRESSED: 'notification_pressed',
  SETTINGS_OPENED: 'settings_opened',
  EDIT_PROFILE_PRESSED: 'edit_profile_pressed',
  CHAT_BUTTON_PRESSED: 'chat_button_pressed',
  PHOTO_SELECTED: 'photo_selected',
  PHOTO_UPLOADED: 'photo_uploaded',
  MAIN_PHOTO_SELECTED: 'main_photo_selected',
  PHOTO_REPLACED: 'photo_replaced',
  PHOTO_DELETED: 'photo_deleted',
  DATE_TIME_SELECTED: 'date_time_selected',
  CHALLENGE_BUTTON_PRESSED: 'challenge_button_pressed',
  NOPE_BUTTON_PRESSED: 'nope_button_pressed',
  
  // Onboarding
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_NEXT: 'onboarding_next',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_SKIPPED: 'onboarding_skipped',
  ONBOARDING_FORM_FIELD_UPDATED: 'onboarding_form_field_updated',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
  ONBOARDING_FORM_SUBMITTED: 'onboarding_form_submitted',
} as const;
