import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../shared/stores/authStore';
import { useUserStore } from '../shared/stores/userStore';
import { useOnboardingStore } from '../features/onboarding/store/onboardingStore';
import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';
import { OnboardingSlider } from '../features/auth/screens/OnboardingSlider';
import { OnboardingForm } from '../features/auth/screens/OnboardingForm';
import { RootStackParamList } from '../shared/types/navigation';
import { logEvent, Events } from '../shared/utils/analytics';

// Development mode flag - set to true to always show full onboarding flow for testing
const DEV_MODE_RESET_ONBOARDING = false; // Change to false for production

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, hasCompletedProfile, user } = useAuthStore();
  const { hasSeenOnboarding } = useOnboardingStore();
  
  // For development: allow progression but reset persistence on app restart
  const devHasSeenOnboarding = hasSeenOnboarding; // Always use current state to allow progression
  const devIsAuthenticated = DEV_MODE_RESET_ONBOARDING ? false : isAuthenticated;
  const devHasCompletedProfile = DEV_MODE_RESET_ONBOARDING ? false : hasCompletedProfile;

  React.useEffect(() => {
    // Initialize auth store and onboarding store on app start
    const initializeStores = async () => {
      await useAuthStore.getState().initialize();
      await useOnboardingStore.getState().loadPersistedState();
      
      // In development mode, reset onboarding state on app start
      if (DEV_MODE_RESET_ONBOARDING) {
        // Reset onboarding state to force showing slides
        useOnboardingStore.getState().resetOnboardingState();
        // Note: Auth and profile states are already handled by the dev flags above
      }
    };
    
    initializeStores();
  }, []);

  React.useEffect(() => {
    if (isAuthenticated && user) {
      logEvent(Events.SCREEN_VIEWED, { screenName: 'Main' });
      
      const { loadProfile } = useUserStore.getState();
      loadProfile(user.id, user.email || '').catch(console.error);
    } else if (user && !isAuthenticated) {
      logEvent(Events.SCREEN_VIEWED, { screenName: 'Onboarding' });
    } else {
      logEvent(Events.SCREEN_VIEWED, { screenName: 'Auth' });
    }
  }, [isAuthenticated, user]);

  const handleNavigationStateChange = () => {
    logEvent(Events.SCREEN_VIEWED, {
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <NavigationContainer onStateChange={handleNavigationStateChange}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!devHasSeenOnboarding ? (
          // Step 1: OnboardingSlider
          <Stack.Screen name="OnboardingSlider" component={OnboardingSlider} />
        ) : !devIsAuthenticated ? (
          // Step 2: Authentication Screens
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !devHasCompletedProfile ? (
          // Step 3: OnboardingForm (profile setup)
          <Stack.Screen name="OnboardingForm" component={OnboardingForm} />
        ) : (
          // Step 4: Main App (DiscoveryScreen)
          <Stack.Screen name="Main" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
