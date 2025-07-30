import React from 'react';
import { View, ScrollView } from 'react-native';
import { Typography } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';
import { SportChip } from '../SportChip';
import { SportFilterChipsGroupProps } from './SportFilterChipsGroup.types';
import { styles } from './SportFilterChipsGroup.styles';
import { t } from '../../../shared/utils/i18n';

export const SportFilterChipsGroup: React.FC<SportFilterChipsGroupProps> = ({
  availableFilters,
  selectedFilters,
  onChange,
  title,
  showClearAll = true,
  showSelectAll = false,
  style,
}) => {
  const handleSportToggle = (sportId: string) => {
    const isSelected = selectedFilters.includes(sportId);
    if (isSelected) {
      onChange(selectedFilters.filter(id => id !== sportId));
    } else {
      onChange([...selectedFilters, sportId]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const handleSelectAll = () => {
    onChange(availableFilters.map(sport => sport.id));
  };

  return (
    <View style={[styles.container, style]}>
      {title && (
        <View style={styles.header}>
          <Typography variant="body" color="primary" weight="medium">
            {title}
          </Typography>
          
          <View style={styles.actions}>
            {showSelectAll && (
              <Button
                variant="ghost"
                size="sm"
                onPress={handleSelectAll}
                disabled={selectedFilters.length === availableFilters.length}
              >
                {t('common.selectAll')}
              </Button>
            )}
            
            {showClearAll && selectedFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onPress={handleClearAll}
              >
                {t('common.clear')}
              </Button>
            )}
          </View>
        </View>
      )}
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.chipsContainer}>
          {availableFilters.map((sport) => (
            <SportChip
              key={sport.id}
              sport={sport}
              selected={selectedFilters.includes(sport.id)}
              onPress={() => handleSportToggle(sport.id)}
              size="sm"
              style={styles.chip}
            />
          ))}
        </View>
      </ScrollView>
      
      {selectedFilters.length > 0 && (
        <Typography variant="caption" color="secondary" style={styles.counter}>
          {selectedFilters.length} selected
        </Typography>
      )}
    </View>
  );
};
