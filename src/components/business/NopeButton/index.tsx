import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NopeButtonProps } from './NopeButton.types';
import { styles } from './NopeButton.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const NopeButton: React.FC<NopeButtonProps> = ({
  onPress,
  disabled = false,
  size = 'lg',
  style,
}) => {
  const handlePress = () => {
    if (disabled) return;
    logEvent(Events.NOPE_BUTTON_PRESSED, { size });
    onPress();
  };

  return (
    <Pressable
      style={[
        styles.container,
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
    >
      <Ionicons
        name="close"
        size={size === 'sm' ? 20 : size === 'lg' ? 32 : 24}
        color={disabled ? theme.colors.text.tertiary : theme.colors.status.error}
      />
    </Pressable>
  );
};
