console.log('Supabase URL from env:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('Supabase Key from env:', process.env.EXPO_PUBLIC_SUPABASE_KEY);



import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppNavigator } from './src/navigation/AppNavigator';
import { logEvent, Events } from './src/shared/utils/analytics';
import { useAuthStore } from './src/shared/stores/authStore';
import { supabase } from './src/config/supabase';

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
  React.useEffect(() => {
    logEvent(Events.APP_OPENED, {
      timestamp: new Date().toISOString(),
    });

    useAuthStore.getState().initialize();

    // Test Supabase connection with detailed error logging
    const testSupabase = async () => {
      try {
        console.log('Testing Supabase connection...');
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) throw error;
        console.log('Supabase Data:', data);
        console.log('Supabase connection successful!');
      } catch (err) {
        console.error('Supabase Error:', err);
        console.error('Error details:', JSON.stringify(err, null, 2));
      }
    };

    testSupabase();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigator />
      <StatusBar style="light" backgroundColor="#0B0D10" />
    </QueryClientProvider>
  );
}
