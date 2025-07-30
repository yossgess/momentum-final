import React from 'react';
import { Pressable } from 'react-native';
import { IconBadge } from '../IconBadge';
import { ChatButtonProps } from './ChatButton.types';
import { styles } from './ChatButton.styles';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const ChatButton: React.FC<ChatButtonProps> = ({
  unreadCount = 0,
  onPress,
  disabled = false,
  style,
}) => {
  const handlePress = () => {
    if (disabled) return;
    logEvent(Events.CHAT_BUTTON_PRESSED, { unreadCount });
    onPress();
  };

  return (
    <Pressable
      style={[styles.container, disabled && styles.disabled, style]}
      onPress={handlePress}
      disabled={disabled}
    >
      <IconBadge
        icon="chatbubble"
        badgeCount={unreadCount}
        onPress={handlePress}
      />
    </Pressable>
  );
};
