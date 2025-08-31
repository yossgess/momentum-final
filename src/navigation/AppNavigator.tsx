import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../shared/stores/authStore';
import { useUserStore } from '../shared/stores/userStore';
import { useOnboardingStore } from '../stores/onboardingStore';
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
  const { hasSeenOnboarding } = useOnboardingStore();
  const [currentScreen, setCurrentScreen] = React.useState<NavigationScreen | null>(null);
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false);
  const [isProfileCheckComplete, setIsProfileCheckComplete] = React.useState<boolean>(false);


  React.useEffect(() => {
    const initializeNavigation = async () => {
      try {
        console.log('[NAVIGATION] Initializing navigation system...');
        
        // Initialize auth store first and wait for completion
        await useAuthStore.getState().initialize();
        
        // Get fresh auth state after initialization
        const authState = useAuthStore.getState();
        console.log('[NAVIGATION] Auth state after initialization:', {
          isAuthenticated: authState.isAuthenticated,
          hasCompletedProfile: authState.hasCompletedProfile,
          userId: authState.user?.id
        });
        
        // If user is authenticated, explicitly wait for profile completion check
        if (authState.isAuthenticated && authState.user) {
          console.log('[NAVIGATION] User authenticated, checking profile completion...');
          await authState.checkProfileCompletion(authState.user.id);
          console.log('[NAVIGATION] Profile completion check finished');
        }
        
        // Mark profile check as complete
        setIsProfileCheckComplete(true);
        
        // Get final user state for navigation decision
        const finalAuthState = useAuthStore.getState();
        const userState = await navigationService.getUserState({
          isAuthenticated: finalAuthState.isAuthenticated,
          hasCompletedProfile: finalAuthState.hasCompletedProfile,
          user: finalAuthState.user,
        });

        // Determine which screen to show based on consistent rules
        const decision = await navigationService.determineNavigationScreen(userState);
        
        // Log the navigation decision
        navigationService.logNavigationDecision(decision);
        
        // Set the screen to show
        setCurrentScreen(decision.screen);
        
      } catch (error) {
        console.error('[NAVIGATION] Initialization error:', error);
        // Fallback to auth screen on error
        setCurrentScreen('Auth');
        setIsProfileCheckComplete(true);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeNavigation();
  }, []); // Initialize only once

  // Re-evaluate navigation when auth state or onboarding state changes
  React.useEffect(() => {
    if (isInitialized && isProfileCheckComplete) {
      const reevaluateNavigation = async () => {
        try {
          console.log('[NAVIGATION] Re-evaluating navigation with state:', {
            isAuthenticated,
            hasCompletedProfile,
            userId: user?.id,
            hasSeenOnboarding
          });
          
          const userState = await navigationService.getUserState({
            isAuthenticated,
            hasCompletedProfile,
            user,
          });

          const decision = await navigationService.determineNavigationScreen(userState);
          navigationService.logNavigationDecision(decision);
          setCurrentScreen(decision.screen);
        } catch (error) {
          console.error('[NAVIGATION] Re-evaluation error:', error);
        }
      };

      reevaluateNavigation();
    }
  }, [isAuthenticated, hasCompletedProfile, user, isInitialized, isProfileCheckComplete, hasSeenOnboarding]);

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

  // Show loading screen until initialization and profile check are complete
  if (!isInitialized || !isProfileCheckComplete || !currentScreen) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
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
