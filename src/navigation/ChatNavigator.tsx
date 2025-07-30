import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatStackParamList } from '../shared/types/navigation';
import { ChatListScreen } from '../features/chat/screens/ChatListScreen';

const Stack = createStackNavigator<ChatStackParamList>();

export const ChatNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatListScreen} />
    </Stack.Navigator>
  );
};
