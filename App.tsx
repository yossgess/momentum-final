console.log('Supabase URL from env:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('Supabase Key from env:', process.env.EXPO_PUBLIC_SUPABASE_KEY);



import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Platform, StatusBar as RNStatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SplashScreen as CustomSplashScreen } from './src/components/atoms/SplashScreen';
import { logEvent, Events } from './src/shared/utils/analytics';
import { useAuthStore } from './src/shared/stores/authStore';
import { supabase } from './src/config/supabase';
import { pushNotificationService } from './src/shared/services/pushNotificationService';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function prepare() {
      const startTime = Date.now();
      
      try {
        // Log app opened event
        logEvent(Events.APP_OPENED, {
          timestamp: new Date().toISOString(),
        });

        // Run all initialization tasks in parallel for faster loading
        await Promise.all([
          // Initialize auth store
          useAuthStore.getState().initialize(),
          
          // Initialize push notifications
          pushNotificationService.initialize().catch((error: any) => {
            console.error('Error initializing push notifications:', error);
            return false;
          }),
          
          // Test Supabase connection
          (async () => {
            try {
              const { data, error } = await supabase.from('profiles').select('*');
              if (error) {
                console.error('Supabase Error:', error);
              } else {
                console.log('Supabase connection successful!');
              }
            } catch (err: any) {
              console.error('Supabase Error:', err);
            }
          })()
        ]);

        // Ensure splash screen shows for minimum 3 seconds
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 3000 - elapsedTime);
        
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
      } catch (e) {
        console.warn(e);
        // Ensure 3 seconds minimum even on error
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 3000 - elapsedTime);
        
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
      } finally {
        setIsLoading(false);
      }
    }

    prepare();
  }, []);

  if (isLoading) {
    return <CustomSplashScreen />;
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      edges={['top', 'left', 'right']}
    >
      <View style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <AppNavigator />
          <StatusBar style="dark" backgroundColor="#FFFFFF" />
        </QueryClientProvider>
      </View>
    </SafeAreaView>
  );
}
