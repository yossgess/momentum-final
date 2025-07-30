import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MatchZoneStackParamList } from '../shared/types/navigation';
import { MatchZoneScreen } from '../features/matchzone/screens/MatchZoneScreen';

const Stack = createStackNavigator<MatchZoneStackParamList>();

export const MatchZoneNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MatchZoneScreen" component={MatchZoneScreen} />
    </Stack.Navigator>
  );
};
