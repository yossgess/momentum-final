import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RevertButtonProps } from './RevertButton.types';
import { styles } from './RevertButton.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const RevertButton: React.FC<RevertButtonProps> = ({
  onPress,
  disabled = false,
  size = 'lg',
  style,
}) => {
  const handlePress = () => {
    if (disabled) return;
    logEvent(Events.BUTTON_PRESSED, { buttonType: 'revert', size });
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
        name="arrow-undo"
        size={size === 'sm' ? 20 : size === 'lg' ? 32 : 24}
        color={disabled ? theme.colors.text.tertiary : theme.colors.text.secondary}
      />
    </Pressable>
  );
};
