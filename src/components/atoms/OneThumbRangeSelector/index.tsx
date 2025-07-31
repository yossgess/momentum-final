import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { theme } from '../../../theme';

export interface OneThumbRangeSelectorProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  trackColor?: string;
  activeTrackColor?: string;
  thumbColor?: string;
  thumbSize?: number;
  trackHeight?: number;
  style?: any;
  disabled?: boolean;
}

export const OneThumbRangeSelector: React.FC<OneThumbRangeSelectorProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  trackColor = theme.colors.surface.secondary,
  activeTrackColor = theme.colors.primary.main,
  thumbColor = theme.colors.primary.main,
  style,
  disabled = false,
}) => {
  const handleValueChange = useCallback((newValue: number) => {
    const adjustedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(adjustedValue, max));
    onChange(clampedValue);
  }, [min, max, step, onChange]);

  return (
    <View style={[styles.container, style]}>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
        minimumTrackTintColor={activeTrackColor}
        maximumTrackTintColor={trackColor}
        thumbTintColor={thumbColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  thumb: {
    width: 24,
    height: 24,
    shadowColor: theme.colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
});
