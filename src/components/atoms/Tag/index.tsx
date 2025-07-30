import React from 'react';
import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TagProps } from './Tag.types';
import { styles } from './Tag.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const Tag: React.FC<TagProps> = ({
  label,
  variant = 'default',
  size = 'md',
  selected = false,
  closable = false,
  onPress,
  onClose,
  disabled = false,
}) => {
  const handlePress = () => {
    if (disabled) return;
    logEvent(Events.TAG_PRESSED, { label, variant, selected });
    onPress?.();
  };

  const handleClose = () => {
    if (disabled) return;
    logEvent(Events.TAG_CLOSED, { label });
    onClose?.();
  };

  return (
    <Pressable
      style={[
        styles.container,
        styles[variant],
        size === 'sm' ? styles.containerSm : size === 'lg' ? styles.containerLg : styles.containerMd,
        selected && styles.selected,
        disabled && styles.disabled,
      ]}
      onPress={handlePress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.text,
          size === 'sm' ? styles.textSm : size === 'lg' ? styles.textLg : styles.textMd,
          selected && styles.textSelected,
          disabled && styles.textDisabled,
        ]}
      >
        {label}
      </Text>
      
      {closable && (
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={14} color={theme.colors.text.secondary} />
        </Pressable>
      )}
    </Pressable>
  );
};
