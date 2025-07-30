import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { logEvent, Events } from './src/shared/utils/analytics';

export default function App() {
  React.useEffect(() => {
    logEvent(Events.APP_OPENED, {
      timestamp: new Date().toISOString(),
    });
  }, []);

  return (
    <>
      <AppNavigator />
      <StatusBar style="light" backgroundColor="#0B0D10" />
    </>
  );
}
