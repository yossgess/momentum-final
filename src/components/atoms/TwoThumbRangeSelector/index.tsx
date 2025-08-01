import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
// import { RangeSlider } from '@react-native-assets/slider'; // Placeholder - requires native module
import { theme } from '../../../theme';

export interface TwoThumbRangeSelectorProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
  trackColor?: string;
  activeTrackColor?: string;
  thumbColor?: string;
  thumbSize?: number;
  trackHeight?: number;
  style?: any;
  disabled?: boolean;
}

export const TwoThumbRangeSelector: React.FC<TwoThumbRangeSelectorProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  trackColor = theme.colors.surface.secondary,
  activeTrackColor = theme.colors.primary.main,
  thumbColor = theme.colors.primary.main,
  thumbSize = 24,
  trackHeight = 4,
  style,
  disabled = false,
}) => {
  const handleValueChange = useCallback((newValue: [number, number]) => {
    // Ensure thumbs don't overlap and maintain minimum distance
    const [minVal, maxVal] = newValue;
    const minDistance = step;
    
    let adjustedMin = Math.round(minVal / step) * step;
    let adjustedMax = Math.round(maxVal / step) * step;
    
    // Ensure minimum distance between thumbs
    if (adjustedMax - adjustedMin < minDistance) {
      if (adjustedMin !== value[0]) {
        // Min thumb moved, adjust max
        adjustedMax = Math.min(adjustedMin + minDistance, max);
      } else {
        // Max thumb moved, adjust min
        adjustedMin = Math.max(adjustedMax - minDistance, min);
      }
    }
    
    // Clamp values to bounds
    adjustedMin = Math.max(min, Math.min(adjustedMin, max));
    adjustedMax = Math.max(min, Math.min(adjustedMax, max));
    
    onChange([adjustedMin, adjustedMax]);
  }, [min, max, step, value, onChange]);

  return (
    <View style={[styles.container, style]}>
      {/* RangeSlider placeholder - requires @react-native-assets/slider */}
      <View style={styles.slider}>
        <View style={[styles.rail, { backgroundColor: trackColor, height: trackHeight }]} />
        <View style={[styles.railSelected, { backgroundColor: activeTrackColor, height: trackHeight, width: '50%' }]} />
        <View style={[styles.thumb, { backgroundColor: thumbColor, width: thumbSize, height: thumbSize, left: '20%' }]} />
        <View style={[styles.thumb, { backgroundColor: thumbColor, width: thumbSize, height: thumbSize, left: '70%' }]} />
      </View>
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
    shadowColor: theme.colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  rail: {
    flex: 1,
    borderRadius: 2,
  },
  railSelected: {
    borderRadius: 2,
  },
});
