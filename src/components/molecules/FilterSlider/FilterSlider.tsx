import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Typography } from '../../atoms/Typography';
import { DistanceSliderProps, AgeRangeSliderProps } from './FilterSlider.types';
import { styles } from './FilterSlider.styles';
import { theme } from '../../../theme';
import { logEvent } from '../../../shared/utils/analytics';
import { t } from '../../../shared/utils/i18n';

export const DistanceSlider: React.FC<DistanceSliderProps> = ({
  value,
  onValueChange,
  min = 10,
  max = 100,
  step = 1,
  unit = 'km',
  style,
  testID = 'distance-slider',
}) => {
  const handleValueChange = useCallback((newValue: number) => {
    const roundedValue = Math.round(newValue);
    onValueChange(roundedValue);
    
    logEvent('slider_changed', {
      type: 'distance',
      value: roundedValue,
    });
  }, [onValueChange]);

  return (
    <View style={[styles.container, styles.distanceContainer, style]}>
      <View style={styles.distanceLabelContainer}>
        <View style={styles.distanceLabel}>
          <Text style={styles.distanceLabelText}>
            {value} {unit}
          </Text>
        </View>
      </View>
      
      <Slider
        style={styles.distanceSlider}
        value={value}
        onValueChange={handleValueChange}
        minimumValue={min}
        maximumValue={max}
        step={step}
        minimumTrackTintColor={theme.colors.primary.main}
        maximumTrackTintColor={theme.colors.border.secondary}
        thumbTintColor={theme.colors.primary.main}
        testID={testID}
      />
      
      <View style={styles.distanceRangeLabels}>
        <Typography variant="caption" color="tertiary">
          {min} {unit}
        </Typography>
        <Typography variant="caption" color="tertiary">
          {max} {unit}
        </Typography>
      </View>
    </View>
  );
};

export const AgeRangeSlider: React.FC<AgeRangeSliderProps> = ({
  values,
  onValuesChange,
  min = 18,
  max = 65,
  step = 1,
  unit = 'years',
  style,
  testID = 'age-range-slider',
}) => {
  const handleValuesChange = useCallback((newValues: number[]) => {
    const [minAge, maxAge] = newValues;
    onValuesChange([minAge, maxAge]);
    
    logEvent('slider_changed', {
      type: 'age_range',
      minAge,
      maxAge,
    });
  }, [onValuesChange]);

  return (
    <View style={[styles.container, styles.ageRangeContainer, style]} testID={testID}>
      <View style={styles.ageRangeLabelsContainer}>
        <View style={styles.ageRangeLabel}>
          <Text style={styles.ageRangeLabelText}>
            {values[0]}
          </Text>
        </View>
        <View style={styles.ageRangeLabel}>
          <Text style={styles.ageRangeLabelText}>
            {values[1] === max ? `${values[1]}+` : values[1]}
          </Text>
        </View>
      </View>
      
      <MultiSlider
        values={values}
        onValuesChange={handleValuesChange}
        min={min}
        max={max}
        step={step}
        allowOverlap={false}
        snapped
        selectedStyle={{
          backgroundColor: theme.colors.primary.main,
          height: 4,
        }}
        unselectedStyle={{
          backgroundColor: theme.colors.border.secondary,
          height: 4,
        }}
        markerStyle={{
          backgroundColor: theme.colors.primary.main,
          width: 24,
          height: 24,
          shadowColor: theme.colors.shadow.medium,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
        }}
        containerStyle={styles.ageRangeSlider}
        trackStyle={{
          height: 4,
          borderRadius: 2,
        }}
      />
      
      <View style={styles.ageRangeMinMaxLabels}>
        <Typography variant="caption" color="tertiary">
          {min}
        </Typography>
        <Typography variant="caption" color="tertiary">
          {max}+
        </Typography>
      </View>
    </View>
  );
};
