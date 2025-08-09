import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../atoms/Typography';
import { FilterButtonProps } from './FilterButton.types';
import { styles } from './FilterButton.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const FilterButton: React.FC<FilterButtonProps> = ({
  onPress,
  active = false,
  label,
  style,
}) => {
  const handlePress = () => {
    logEvent(Events.FILTER_APPLIED, { active });
    onPress();
  };

  return (
    <Pressable
      style={[
        styles.container,
        active && styles.containerActive,
        style,
      ]}
      onPress={handlePress}
    >
      <Ionicons
        name="funnel"
        size={28}
        color={theme.colors.text.primary}
      />
    </Pressable>
  );
};
