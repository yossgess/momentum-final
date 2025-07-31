import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MainTabParamList } from '../shared/types/navigation';
import { DiscoveryNavigator } from './DiscoveryNavigator';
import { EventsNavigator } from './EventsNavigator';
import { MatchZoneNavigator } from './MatchZoneNavigator';
import { ChatNavigator } from './ChatNavigator';
import { ProfileNavigator } from './ProfileNavigator';
import { theme } from '../theme';
import { t } from '../shared/utils/i18n';
import { logEvent, Events } from '../shared/utils/analytics';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator: React.FC = () => {
  const handleTabPress = (routeName: string) => {
    logEvent(Events.TAB_SWITCHED, {
      tabName: routeName,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface.primary,
          borderTopColor: theme.colors.border.primary,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 85 : 65,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 8,
          shadowColor: theme.colors.shadow.dark,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSize.xs,
          fontFamily: theme.typography.fontFamily.medium,
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        tabBarHideOnKeyboard: false,
      }}
    >
      <Tab.Screen
        name="Discovery"
        component={DiscoveryNavigator}
        options={{
          tabBarLabel: t('nav.discovery'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress('Discovery'),
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsNavigator}
        options={{
          tabBarLabel: t('nav.events'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress('Events'),
        }}
      />
      <Tab.Screen
        name="MatchZone"
        component={MatchZoneNavigator}
        options={{
          tabBarLabel: t('nav.matchzone'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="trophy" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress('MatchZone'),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatNavigator}
        options={{
          tabBarLabel: t('nav.chat'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress('Chat'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarLabel: t('nav.profile'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress('Profile'),
        }}
      />
    </Tab.Navigator>
  );
};
