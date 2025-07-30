import React from 'react';
import { View, ScrollView } from 'react-native';
import { Typography } from '../../atoms/Typography';
import { SportChip } from '../SportChip';
import { CommonSportsDisplayProps } from './CommonSportsDisplay.types';
import { styles } from './CommonSportsDisplay.styles';
import { t } from '../../../shared/utils/i18n';

export const CommonSportsDisplay: React.FC<CommonSportsDisplayProps> = ({
  sharedSports,
  userSports,
  title,
  showTitle = true,
  style,
}) => {
  const allSports = [...sharedSports, ...userSports];

  if (allSports.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {showTitle && (
        <Typography variant="body" color="primary" weight="medium" style={styles.title}>
          {title || t('profile.sports')}
        </Typography>
      )}
      
      {sharedSports.length > 0 && (
        <View style={styles.section}>
          <Typography variant="caption" color="success" style={styles.sectionTitle}>
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
      )}
      
      {userSports.length > 0 && (
        <View style={styles.section}>
          <Typography variant="caption" color="secondary" style={styles.sectionTitle}>
            {t('discovery.otherSports')} ({userSports.length})
          </Typography>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
            <View style={styles.chipsContainer}>
              {userSports.map((sport) => (
                <SportChip
                  key={sport.id}
                  sport={sport}
                  selected={false}
                  variant="outlined"
                  size="sm"
                  style={styles.chip}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};
