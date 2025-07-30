import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { EventsStackParamList } from '../shared/types/navigation';
import { EventsListScreen } from '../features/events/screens/EventsListScreen';

const Stack = createStackNavigator<EventsStackParamList>();

export const EventsNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventsList" component={EventsListScreen} />
    </Stack.Navigator>
  );
};
