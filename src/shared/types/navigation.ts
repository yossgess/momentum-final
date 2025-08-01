import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  OnboardingSlider: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  OnboardingForm: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  OnboardingSlider: undefined;
  Welcome: undefined;
  SignIn: undefined;
  Signup: undefined;
  OnboardingForm: undefined;
};

export type MainTabParamList = {
  Discovery: NavigatorScreenParams<DiscoveryStackParamList>;
  Events: NavigatorScreenParams<EventsStackParamList>;
  MatchZone: NavigatorScreenParams<MatchZoneStackParamList>;
  Chat: NavigatorScreenParams<ChatStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type DiscoveryStackParamList = {
  DiscoveryScreen: undefined;
  ProfileDetail: { userId: string };
  MatchModal: { matchId: string };
  FiltersModal: undefined;
};

export type EventsStackParamList = {
  EventsList: undefined;
  EventDetails: { eventId: string };
  CreateEvent: undefined;
  EventParticipants: { eventId: string };
};

export type MatchZoneStackParamList = {
  MatchZoneScreen: undefined;
  CoachProfile: { coachId: string };
  CourtDetails: { courtId: string };
  BookingScreen: { coachId?: string; courtId?: string };
};

export type ChatStackParamList = {
  ChatList: undefined;
  ChatScreen: { chatId: string };
  MatchProfile: { userId: string };
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Notifications: undefined;
  HelpSupport: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
