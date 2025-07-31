import React, { useCallback } from 'react';
import { View, AccessibilityInfo } from 'react-native';
import { Typography } from '../Typography';
import { TwoThumbRangeSelector } from '../TwoThumbRangeSelector';
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
  const handleRangeChange = useCallback((newRange: [number, number]) => {
    onChange(newRange);
    logEvent('AgeRangeSelector_Changed', { 
      from: newRange[0], 
      to: newRange[1] 
    });
  }, [onChange]);

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
      
      <TwoThumbRangeSelector
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleRangeChange}
        activeTrackColor={theme.colors.primary.main}
        trackColor={theme.colors.border.secondary}
        thumbColor={theme.colors.primary.main}
        style={styles.slider}
      />
    </View>
  );
};
