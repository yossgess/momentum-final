import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../shared/stores/authStore';
import { useUserStore } from '../shared/stores/userStore';
import { navigationService, NavigationScreen } from '../shared/services/navigationService';
import { logEvent, Events } from '../shared/utils/analytics';
import { OnboardingSlider } from '../features/auth/screens/OnboardingSlider';
import { OnboardingForm } from '../features/auth/screens/OnboardingForm';
import { WelcomeNewScreen } from '../features/auth/screens/WelcomeNewScreen';
import { WelcomeBackScreen } from '../features/auth/screens/WelcomeBackScreen';
import { RootStackParamList } from '../shared/types/navigation';
import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';
import { NotificationsScreen } from '../features/notifications/NotificationsScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, hasCompletedProfile, user } = useAuthStore();
  const [currentScreen, setCurrentScreen] = React.useState<NavigationScreen | null>(null);

  // Determine navigation screen based on current auth state
  React.useEffect(() => {
    const determineScreen = async () => {
      try {
        const userState = await navigationService.getUserState({
          isAuthenticated,
          hasCompletedProfile,
          user,
        });

        const decision = await navigationService.determineNavigationScreen(userState);
        navigationService.logNavigationDecision(decision);
        setCurrentScreen(decision.screen);
      } catch (error) {
        console.error('[NAVIGATION] Navigation determination error:', error);
        setCurrentScreen('Auth');
      }
    };

    determineScreen();
  }, [isAuthenticated, hasCompletedProfile, user]);

  // Load user profile when authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const { loadProfile } = useUserStore.getState();
      loadProfile(user.id, user.email || '').catch(console.error);
    }
  }, [isAuthenticated, user]);

  const handleNavigationStateChange = () => {
    logEvent(Events.SCREEN_VIEWED, {
      timestamp: new Date().toISOString(),
      currentScreen: currentScreen || 'unknown',
    });
  };

  // Return null instead of loading screen to prevent flash
  if (!currentScreen) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer onStateChange={handleNavigationStateChange}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {currentScreen === 'OnboardingSlider' ? (
            <Stack.Screen name="OnboardingSlider" component={OnboardingSlider} />
          ) : currentScreen === 'Auth' ? (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          ) : currentScreen === 'OnboardingForm' ? (
            <Stack.Screen name="OnboardingForm" component={OnboardingForm} />
          ) : currentScreen === 'Main' ? (
            <Stack.Screen name="Main" component={TabNavigator} />
          ) : (
            // Fallback screen to prevent empty navigator
            <Stack.Screen name="Auth" component={AuthNavigator} />
          )}
          
          {/* Welcome screens - available for navigation */}
          <Stack.Screen name="WelcomeNew" component={WelcomeNewScreen} />
          <Stack.Screen name="WelcomeBack" component={WelcomeBackScreen} />
          
          {/* Independent screens */}
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      

    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

});
