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
const DEV_MODE_FORCE_ONBOARDING = true; // Change to false for production

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, hasCompletedProfile, user } = useAuthStore();
  const { hasSeenOnboarding } = useOnboardingStore();

  React.useEffect(() => {
    // Initialize auth store and onboarding store on app start
    const initializeStores = async () => {
      await useAuthStore.getState().initialize();
      await useOnboardingStore.getState().loadPersistedState();
      
      // In development mode, reset onboarding state on app start
      if (DEV_MODE_FORCE_ONBOARDING) {
        // Reset onboarding state to force showing slides
        useOnboardingStore.getState().resetOnboardingState();
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

  // Determine which screen to show based on user state
  const getScreenToShow = () => {
    // In development mode, force onboarding slides to show for testing (even if authenticated)
    if (DEV_MODE_FORCE_ONBOARDING && !hasSeenOnboarding) {
      return 'OnboardingSlider';
    }
    
    // For authenticated users, handle their flow first
    if (isAuthenticated && user) {
      // New users (no profile) -> Show OnboardingForm
      if (!hasCompletedProfile) {
        return 'OnboardingForm';
      }
      // Existing users (with profile) -> Show Main App
      else {
        return 'Main';
      }
    }
    
    // For non-authenticated users, check if they need onboarding slides
    if (!isAuthenticated) {
      // In production, only show slides to truly new users who haven't seen them
      if (!hasSeenOnboarding) {
        return 'OnboardingSlider';
      }
      // Existing users (who have seen slides before) -> Go directly to Auth
      else {
        return 'Auth';
      }
    }
    
    // Fallback to auth if something is unclear
    return 'Auth';
  };

  const currentScreen = getScreenToShow();

  return (
    <NavigationContainer onStateChange={handleNavigationStateChange}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {currentScreen === 'OnboardingSlider' && (
          <Stack.Screen name="OnboardingSlider" component={OnboardingSlider} />
        )}
        {currentScreen === 'Auth' && (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
        {currentScreen === 'OnboardingForm' && (
          <Stack.Screen name="OnboardingForm" component={OnboardingForm} />
        )}
        {currentScreen === 'Main' && (
          <Stack.Screen name="Main" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
