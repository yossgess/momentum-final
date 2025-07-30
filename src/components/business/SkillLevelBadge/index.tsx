import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../atoms/Typography';
import { SkillLevelBadgeProps } from './SkillLevelBadge.types';
import { styles } from './SkillLevelBadge.styles';
import { theme } from '../../../theme';

export const SkillLevelBadge: React.FC<SkillLevelBadgeProps> = ({
  level,
  sportName,
  variant = 'small',
  style,
}) => {
  const getIconName = () => {
    switch (level) {
      case 'Beginner':
        return 'star-outline';
      case 'Intermediate':
        return 'star-half';
      case 'Advanced':
        return 'star';
      default:
        return 'star-outline';
    }
  };

  const getColor = () => {
    switch (level) {
      case 'Beginner':
        return theme.colors.status.info;
      case 'Intermediate':
        return theme.colors.status.warning;
      case 'Advanced':
        return theme.colors.status.success;
      default:
        return theme.colors.text.secondary;
    }
  };

  if (variant === 'card') {
    return (
      <View style={[styles.cardContainer, style]}>
        <View style={styles.cardHeader}>
          <Ionicons name="fitness-outline" size={16} color={theme.colors.text.secondary} />
          <Typography variant="caption" color="secondary" style={styles.sportName}>
            {sportName}
          </Typography>
        </View>
        
        <View style={styles.levelContainer}>
          <Ionicons name={getIconName() as any} size={16} color={getColor()} />
          <Typography variant="body" color="primary" weight="medium" style={styles.levelText}>
            {level}
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.smallContainer, { borderColor: getColor() }, style]}>
      <Ionicons name={getIconName() as any} size={12} color={getColor()} />
      <Typography variant="caption" color={getColor()} style={styles.smallText}>
        {level}
      </Typography>
    </View>
  );
};
