import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../Typography';
import { SettingsButtonProps } from './SettingsButton.types';
import { styles } from './SettingsButton.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const SettingsButton: React.FC<SettingsButtonProps> = ({
  onPress,
  variant = 'iconOnly',
  label,
  disabled = false,
  style,
}) => {
  const handlePress = () => {
    if (disabled) return;
    logEvent(Events.SETTINGS_OPENED, { variant });
    onPress();
  };

  return (
    <Pressable
      style={[
        styles.container,
        variant === 'withLabel' && styles.containerWithLabel,
        disabled && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
    >
      <Ionicons
        name="settings"
        size={24}
        color={disabled ? theme.colors.text.tertiary : theme.colors.text.primary}
      />
      
      {variant === 'withLabel' && label && (
        <Typography
          variant="body"
          color={disabled ? 'tertiary' : 'primary'}
          style={styles.label}
        >
          {label}
        </Typography>
      )}
    </Pressable>
  );
};
