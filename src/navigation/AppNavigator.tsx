import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../shared/stores/authStore';
import { useUserStore } from '../shared/stores/userStore';
import { useOnboardingStore } from '../features/onboarding/store/onboardingStore';
import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';
import { OnboardingSlider } from '../features/auth/screens/OnboardingSlider';
import { OnboardingForm } from '../features/auth/screens/OnboardingForm';
import { RootStackParamList } from '../shared/types/navigation';
import { logEvent, Events } from '../shared/utils/analytics';

// Development mode flags - set to true to always show onboarding components for testing
const DEV_MODE_FORCE_ONBOARDING = true; // Change to false for production
const DEV_MODE_FORCE_ONBOARDING_FORM = true; // Set to true to always show onboarding form for testing
const DEV_MODE_CYCLE_SCREENS = true; // Set to true to cycle through all screens on each reload

// Developer mode screen cycling - cycles through all screens on each reload
const DEV_SCREENS = ['OnboardingSlider', 'Auth', 'OnboardingForm', 'Main'] as const;
type DevScreen = typeof DEV_SCREENS[number];

const Stack = createStackNavigator<RootStackParamList>();

// Helper function to get current dev screen index from AsyncStorage
const getDevScreenIndex = async (): Promise<number> => {
  try {
    const stored = await AsyncStorage.getItem('dev_screen_index');
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
};

// Helper function to set next dev screen index in AsyncStorage
const setNextDevScreenIndex = async (currentIndex: number): Promise<void> => {
  try {
    const nextIndex = (currentIndex + 1) % DEV_SCREENS.length;
    await AsyncStorage.setItem('dev_screen_index', nextIndex.toString());
  } catch {
    // Ignore storage errors in dev mode
  }
};

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, hasCompletedProfile, user } = useAuthStore();
  const { hasSeenOnboarding } = useOnboardingStore();
  const [devScreenIndex, setDevScreenIndex] = React.useState<number>(0);
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Initialize auth store and onboarding store on app start
    const initializeStores = async () => {
      try {
        await useAuthStore.getState().initialize();
        await useOnboardingStore.getState().loadPersistedState();
        
        // In development mode, handle screen cycling
        if (DEV_MODE_CYCLE_SCREENS) {
          const currentIndex = await getDevScreenIndex();
          setDevScreenIndex(currentIndex);
          await setNextDevScreenIndex(currentIndex); // Set up next screen for next reload
          
          // Reset onboarding state to allow cycling through all screens
          useOnboardingStore.getState().resetOnboardingState();
          
          console.log(`[DEV MODE] Showing screen: ${DEV_SCREENS[currentIndex]} (${currentIndex + 1}/${DEV_SCREENS.length})`);
        } else if (DEV_MODE_FORCE_ONBOARDING) {
          // Reset onboarding state to force showing slides
          useOnboardingStore.getState().resetOnboardingState();
        }
      } catch (error) {
        console.error('[AppNavigator] Initialization error:', error);
      } finally {
        setIsInitialized(true);
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
  const getScreenToShow = (): DevScreen | 'Auth' | 'OnboardingSlider' | 'OnboardingForm' | 'Main' => {
    // In development mode with screen cycling, override all logic
    if (DEV_MODE_CYCLE_SCREENS) {
      const currentScreen = DEV_SCREENS[devScreenIndex];
      console.log(`[DEV MODE] Current screen from cycle: ${currentScreen}`);
      return currentScreen;
    }
    
    // In development mode, force onboarding slides to show for testing (even if authenticated)
    if (DEV_MODE_FORCE_ONBOARDING && !hasSeenOnboarding) {
      return 'OnboardingSlider';
    }
    
    // For authenticated users, handle their flow first
    if (isAuthenticated && user) {
      // In development mode, force onboarding form to show for testing (even if profile completed)
      if (DEV_MODE_FORCE_ONBOARDING_FORM && !hasCompletedProfile) {
        return 'OnboardingForm';
      }
      
      // New users (no profile) -> Show OnboardingForm
      if (!hasCompletedProfile) {
        return 'OnboardingForm';
      }
      // Existing users (with profile) -> Show Main App (unless dev mode forces onboarding form)
      else {
        // In dev mode, allow access to onboarding form even after completion
        if (DEV_MODE_FORCE_ONBOARDING_FORM) {
          return 'OnboardingForm';
        }
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

  // Show loading screen until initialization is complete
  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const currentScreen = getScreenToShow();

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
        </Stack.Navigator>
      </NavigationContainer>
      
      {/* Developer Mode Indicator */}
      {DEV_MODE_CYCLE_SCREENS && (
        <View style={styles.devIndicator}>
          <Text style={styles.devText}>
            DEV: {currentScreen} ({devScreenIndex + 1}/{DEV_SCREENS.length})
          </Text>
          <Text style={styles.devSubText}>
            Reload to cycle to next screen
          </Text>
        </View>
      )}
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
  devIndicator: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    padding: 8,
    borderRadius: 4,
    zIndex: 9999,
  },
  devText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  devSubText: {
    color: 'white',
    fontSize: 10,
    marginTop: 2,
  },
});
