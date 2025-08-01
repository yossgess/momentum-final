import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../shared/stores/authStore';
import { useUserStore } from '../shared/stores/userStore';
import { useOnboardingStore } from '../features/onboarding/store/onboardingStore';
import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';
import { OnboardingSlider } from '../features/auth/screens/OnboardingSlider';
import { RootStackParamList } from '../shared/types/navigation';
import { logEvent, Events } from '../shared/utils/analytics';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { hasSeenOnboarding } = useOnboardingStore();

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
        {!hasSeenOnboarding ? (
          <Stack.Screen name="OnboardingSlider" component={OnboardingSlider} />
        ) : isAuthenticated ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
