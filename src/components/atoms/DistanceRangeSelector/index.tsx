import React, { useCallback } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../Typography';
import { DistanceRangeSelectorProps } from './DistanceRangeSelector.types';
import { styles } from './DistanceRangeSelector.styles';
import { theme } from '../../../theme';
import { logEvent } from '../../../shared/utils/analytics';
import { t } from '../../../shared/utils/i18n';

export const DistanceRangeSelector: React.FC<DistanceRangeSelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 100,
  step = 5,
  style,
}) => {
  const handleChange = useCallback((newValue: number) => {
    onChange(newValue);
    logEvent('DistanceSelector_Changed', { distance: newValue });
  }, [onChange]);

  // Generate distance options based on step
  const distanceOptions = [];
  for (let i = min; i <= max; i += step) {
    distanceOptions.push(i);
  }

  return (
    <View style={[styles.container, style]}>
      <Typography 
        variant="body" 
        color="primary" 
        weight="bold" 
        style={styles.label}
      >
        {t('filters.distance')}
      </Typography>
      
      <View style={styles.valueContainer}>
        <Ionicons
          name="location-outline"
          size={24}
          color={theme.colors.primary.main}
          style={styles.icon}
        />
        <Typography variant="h3" color="primary">
          {t('common.within')} {value} km
        </Typography>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.optionsContainer}
        contentContainerStyle={styles.optionsContent}
      >
        {distanceOptions.map((distance) => (
          <TouchableOpacity
            key={distance}
            style={[
              styles.optionButton,
              value === distance && styles.optionButtonActive
            ]}
            onPress={() => handleChange(distance)}
          >
            <Typography
              variant="button"
              color={value === distance ? 'primary' : 'secondary'}
              weight={value === distance ? 'bold' : 'normal'}
            >
              {distance}
            </Typography>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.rangeLabels}>
        <Typography variant="caption" color="tertiary">
          {min} km
        </Typography>
        <Typography variant="caption" color="tertiary">
          {max} km
        </Typography>
      </View>
    </View>
  );
};
