import React, { useState } from 'react';
import { View } from 'react-native';
import { View as Slider } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../Typography';
import { DistanceRangeSelectorProps } from './DistanceRangeSelector.types';
import { styles } from './DistanceRangeSelector.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { t } from '../../../shared/utils/i18n';

export const DistanceRangeSelector: React.FC<DistanceRangeSelectorProps> = ({
  min = 0,
  max = 50,
  step = 1,
  initialValue = 25,
  onChange,
  label,
  icon = 'location-outline',
  style,
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newValue: number) => {
    const roundedValue = Math.round(newValue);
    setValue(roundedValue);
    onChange(roundedValue);
    logEvent(Events.DISTANCE_RANGE_CHANGED, { distance: roundedValue });
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Typography variant="body" color="primary" weight="medium" style={styles.label}>
          {label}
        </Typography>
      )}
      
      <View style={styles.valueContainer}>
        {icon && (
          <Ionicons
            name={icon as any}
            size={24}
            color={theme.colors.primary.main}
            style={styles.icon}
          />
        )}
        <Typography variant="h3" color="primary">
          {t('common.within')} {value} km
        </Typography>
      </View>
      
      <View style={styles.slider}>
        <Typography variant="caption" color="secondary">
          Slider component requires @react-native-community/slider
        </Typography>
      </View>
      
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
