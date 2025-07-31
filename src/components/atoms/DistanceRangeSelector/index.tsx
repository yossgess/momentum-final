import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../Typography';
import { OneThumbRangeSelector } from '../OneThumbRangeSelector';
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
  step = 1,
  style,
}) => {
  const handleChange = useCallback((newValue: number) => {
    onChange(newValue);
    logEvent('DistanceSelector_Changed', { distance: newValue });
  }, [onChange]);

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
      
      <OneThumbRangeSelector
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        activeTrackColor={theme.colors.primary.main}
        trackColor={theme.colors.surface.secondary}
        thumbColor={theme.colors.primary.main}
        style={styles.slider}
      />
      
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
