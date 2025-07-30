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
  badgeCount = 0,
  label,
  style,
}) => {
  const handlePress = () => {
    logEvent(Events.FILTER_APPLIED, { active, badgeCount });
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
      <View style={styles.content}>
        <Ionicons
          name="funnel"
          size={20}
          color={active ? theme.colors.primary.main : theme.colors.text.secondary}
        />
        
        {label && (
          <Typography
            variant="body"
            color={active ? theme.colors.primary.main : theme.colors.text.secondary}
            style={styles.label}
          >
            {label}
          </Typography>
        )}
        
        {badgeCount > 0 && (
          <View style={styles.badge}>
            <Typography variant="caption" color={theme.colors.text.primary}>
              {badgeCount}
            </Typography>
          </View>
        )}
      </View>
    </Pressable>
  );
};
