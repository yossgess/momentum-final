import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppNavigator } from './src/navigation/AppNavigator';
import { logEvent, Events } from './src/shared/utils/analytics';
import { useAuthStore } from './src/shared/stores/authStore';

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
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigator />
      <StatusBar style="light" backgroundColor="#0B0D10" />
    </QueryClientProvider>
  );
}
