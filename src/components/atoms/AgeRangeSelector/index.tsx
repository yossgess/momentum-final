import React, { useCallback } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '../Typography';
import { AgeRangeSelectorProps } from './AgeRangeSelector.types';
import { styles } from './AgeRangeSelector.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { t } from '../../../shared/utils/i18n';

export const AgeRangeSelector: React.FC<AgeRangeSelectorProps> = ({
  value,
  onChange,
  min = 18,
  max = 70,
  step = 1,
  style,
}) => {
  const handleMinAgeChange = useCallback((newMinAge: number) => {
    // Ensure min age doesn't exceed max age
    const adjustedMinAge = Math.min(newMinAge, value[1] - 1);
    const newRange: [number, number] = [adjustedMinAge, value[1]];
    onChange(newRange);
    logEvent('AgeRangeSelector_MinChanged', { 
      from: adjustedMinAge, 
      to: value[1] 
    });
  }, [onChange, value]);

  const handleMaxAgeChange = useCallback((newMaxAge: number) => {
    // Ensure max age doesn't go below min age
    const adjustedMaxAge = Math.max(newMaxAge, value[0] + 1);
    const newRange: [number, number] = [value[0], adjustedMaxAge];
    onChange(newRange);
    logEvent('AgeRangeSelector_MaxChanged', { 
      from: value[0], 
      to: adjustedMaxAge 
    });
  }, [onChange, value]);

  // Generate age options (every 2 years for better UX)
  const ageOptions = [];
  for (let i = min; i <= max; i += 2) {
    ageOptions.push(i);
  }

  const displayLabel = `${value[0]} - ${value[1]} ${t('profile.age')}`;

  return (
    <View style={[styles.container, style]}>
      <Typography 
        variant="body" 
        color="primary" 
        weight="bold" 
        style={styles.label}
      >
        {t('filters.ageRange')}
      </Typography>
      
      <View style={styles.valueContainer}>
        <Typography 
          variant="h3" 
          color="primary"
        >
          {displayLabel}
        </Typography>
      </View>
      
      <View style={styles.slidersContainer}>
        <View style={styles.sliderSection}>
          <Typography variant="caption" color="secondary" style={styles.sliderLabel}>
            {t('filters.minAge')}
          </Typography>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.optionsContainer}
            contentContainerStyle={styles.optionsContent}
          >
            {ageOptions.map((age) => (
              <TouchableOpacity
                key={`min-${age}`}
                style={[
                  styles.optionButton,
                  value[0] === age && styles.optionButtonActive
                ]}
                onPress={() => handleMinAgeChange(age)}
              >
                <Typography
                  variant="button"
                  color={value[0] === age ? 'primary' : 'secondary'}
                  weight={value[0] === age ? 'bold' : 'normal'}
                >
                  {age}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.sliderSection}>
          <Typography variant="caption" color="secondary" style={styles.sliderLabel}>
            {t('filters.maxAge')}
          </Typography>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.optionsContainer}
            contentContainerStyle={styles.optionsContent}
          >
            {ageOptions.map((age) => (
              <TouchableOpacity
                key={`max-${age}`}
                style={[
                  styles.optionButton,
                  value[1] === age && styles.optionButtonActive
                ]}
                onPress={() => handleMaxAgeChange(age)}
              >
                <Typography
                  variant="button"
                  color={value[1] === age ? 'primary' : 'secondary'}
                  weight={value[1] === age ? 'bold' : 'normal'}
                >
                  {age}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      
      <View style={styles.rangeLabels}>
        <Typography variant="caption" color="tertiary">
          {min}
        </Typography>
        <Typography variant="caption" color="tertiary">
          {max}
        </Typography>
      </View>
    </View>
  );
};
