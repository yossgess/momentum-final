import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../atoms/Typography';
import { SportChipProps } from './SportChip.types';
import { styles } from './SportChip.styles';
import { theme } from '../../../theme';

export const SportChip: React.FC<SportChipProps> = ({
  sport,
  selected = false,
  onPress,
  variant = 'filled',
  size = 'md',
  disabled = false,
  style,
}) => {
  return (
    <Pressable
      style={[
        styles.container,
        styles[variant],
        styles[size],
        selected && styles.selected,
        disabled && styles.disabled,
        style,
      ]}
      onPress={() => onPress?.(sport)}
      disabled={disabled}
    >
      <View style={styles.content}>
        <Ionicons
          name={sport.icon as any}
          size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
          color={selected ? theme.colors.text.primary : theme.colors.text.secondary}
          style={styles.icon}
        />
        
        <Typography
          variant={size === 'sm' ? 'caption' : 'body'}
          color={selected ? 'primary' : 'secondary'}
          weight={selected ? 'semibold' : 'normal'}
          numberOfLines={1}
        >
          {sport.name}
        </Typography>
      </View>
    </Pressable>
  );
};
