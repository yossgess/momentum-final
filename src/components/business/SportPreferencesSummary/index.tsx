import React from 'react';
import { View, ScrollView } from 'react-native';
import { Typography } from '../../atoms/Typography';
import { SkillLevelBadge } from '../SkillLevelBadge';
import { SportPreferencesSummaryProps } from './SportPreferencesSummary.types';
import { styles } from './SportPreferencesSummary.styles';

export const SportPreferencesSummary: React.FC<SportPreferencesSummaryProps> = ({
  sports,
  title,
  variant = 'list',
  style,
}) => {
  if (sports.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <Typography variant="caption" color="tertiary">
          No sports selected
        </Typography>
      </View>
    );
  }

  if (variant === 'grid') {
    return (
      <View style={[styles.container, style]}>
        {title && (
          <Typography variant="body" color="primary" weight="medium" style={styles.title}>
            {title}
          </Typography>
        )}
        
        <View style={styles.grid}>
          {sports.map((sport) => (
            <SkillLevelBadge
              key={sport.id}
              level={sport.skillLevel || 'Beginner'}
              sportName={sport.name}
              variant="card"
              style={styles.gridItem}
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {title && (
        <Typography variant="body" color="primary" weight="medium" style={styles.title}>
          {title}
        </Typography>
      )}
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.list}>
          {sports.map((sport) => (
            <SkillLevelBadge
              key={sport.id}
              level={sport.skillLevel || 'Beginner'}
              sportName={sport.name}
              variant="small"
              style={styles.listItem}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
