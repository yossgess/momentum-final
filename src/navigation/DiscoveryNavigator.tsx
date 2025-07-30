import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DiscoveryStackParamList } from '../shared/types/navigation';
import { DiscoveryScreen } from '../features/discovery/screens/DiscoveryScreen';

const Stack = createStackNavigator<DiscoveryStackParamList>();

export const DiscoveryNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DiscoveryScreen" component={DiscoveryScreen} />
    </Stack.Navigator>
  );
};
