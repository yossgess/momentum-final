import React, { useState } from 'react';
import { View } from 'react-native';
import { View as Slider } from 'react-native';
import { Typography } from '../Typography';
import { AgeRangeSelectorProps } from './AgeRangeSelector.types';
import { styles } from './AgeRangeSelector.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { t } from '../../../shared/utils/i18n';

export const AgeRangeSelector: React.FC<AgeRangeSelectorProps> = ({
  min = 18,
  max = 65,
  step = 1,
  initialRange = [25, 35],
  onChange,
  label,
  style,
}) => {
  const [range, setRange] = useState(initialRange);

  const handleMinChange = (value: number) => {
    const newRange: [number, number] = [Math.round(value), range[1]];
    if (newRange[0] <= newRange[1]) {
      setRange(newRange);
      onChange(newRange);
      logEvent(Events.AGE_RANGE_CHANGED, { min: newRange[0], max: newRange[1] });
    }
  };

  const handleMaxChange = (value: number) => {
    const newRange: [number, number] = [range[0], Math.round(value)];
    if (newRange[0] <= newRange[1]) {
      setRange(newRange);
      onChange(newRange);
      logEvent(Events.AGE_RANGE_CHANGED, { min: newRange[0], max: newRange[1] });
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Typography variant="body" color="primary" weight="medium" style={styles.label}>
          {label}
        </Typography>
      )}
      
      <View style={styles.valueContainer}>
        <Typography variant="h3" color="primary">
          {range[0]} - {range[1]} {t('profile.age')}
        </Typography>
      </View>
      
      <View style={styles.slidersContainer}>
        <View style={styles.sliderWrapper}>
          <Typography variant="caption" color="secondary" style={styles.sliderLabel}>
            {t('common.minimum')}
          </Typography>
          <View style={styles.slider}>
            <Typography variant="caption" color="secondary">
              Slider component requires @react-native-community/slider
            </Typography>
          </View>
        </View>
        
        <View style={styles.sliderWrapper}>
          <Typography variant="caption" color="secondary" style={styles.sliderLabel}>
            {t('common.maximum')}
          </Typography>
          <View style={styles.slider}>
            <Typography variant="caption" color="secondary">
              Slider component requires @react-native-community/slider
            </Typography>
          </View>
        </View>
      </View>
    </View>
  );
};
