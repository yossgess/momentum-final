import React from 'react';
import { View, ScrollView } from 'react-native';
import { Typography } from '../../atoms/Typography';
import { SportChip } from '../SportChip';
import { CommonSportsDisplayProps } from './CommonSportsDisplay.types';
import { styles } from './CommonSportsDisplay.styles';
import { t } from '../../../shared/utils/i18n';

export const CommonSportsDisplay: React.FC<CommonSportsDisplayProps> = ({
  sharedSports,
  userSports = [], // Default to empty array for backward compatibility
  title,
  showTitle = true,
  style,
}) => {
  
  // Only show if there are shared sports (common sports between users)
  if (sharedSports.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {showTitle && (
        <Typography variant="body" color="inverse" weight="medium" style={styles.title}>
          {title || t('profile.sports')}
        </Typography>
      )}
      
      <View style={styles.section}>
        <Typography variant="caption" color="inverse" style={styles.sectionTitle}>
          {t('discovery.commonSports')} ({sharedSports.length})
        </Typography>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
          <View style={styles.chipsContainer}>
            {sharedSports.map((sport) => (
              <SportChip
                key={sport.id}
                sport={sport}
                selected={true}
                variant="gradient"
                size="sm"
                style={styles.chip}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
