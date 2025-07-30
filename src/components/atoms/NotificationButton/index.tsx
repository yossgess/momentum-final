import React from 'react';
import { Pressable } from 'react-native';
import { IconBadge } from '../IconBadge';
import { NotificationButtonProps } from './NotificationButton.types';
import { styles } from './NotificationButton.styles';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const NotificationButton: React.FC<NotificationButtonProps> = ({
  badgeCount = 0,
  onPress,
  disabled = false,
  style,
}) => {
  const handlePress = () => {
    if (disabled) return;
    logEvent(Events.NOTIFICATION_PRESSED, { badgeCount });
    onPress();
  };

  return (
    <Pressable
      style={[styles.container, disabled && styles.disabled, style]}
      onPress={handlePress}
      disabled={disabled}
    >
      <IconBadge
        icon="notifications"
        badgeCount={badgeCount}
        onPress={handlePress}
      />
    </Pressable>
  );
};
