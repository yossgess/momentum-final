import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { SwitchProps } from './Switch.types';
import { styles } from './Switch.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const Switch: React.FC<SwitchProps> = ({
  value,
  onToggle,
  label,
  disabled = false,
  size = 'md',
  activeColor = theme.colors.primary.main,
  inactiveColor = theme.colors.surface.tertiary,
}) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const handleToggle = () => {
    if (!disabled) {
      logEvent(Events.SWITCH_TOGGLED, { label, newValue: !value });
      onToggle(!value);
    }
  };

  const getTrackWidth = () => {
    switch (size) {
      case 'sm': return 40;
      case 'lg': return 60;
      default: return 50;
    }
  };

  const getThumbSize = () => {
    switch (size) {
      case 'sm': return 16;
      case 'lg': return 26;
      default: return 21;
    }
  };

  const trackWidth = getTrackWidth();
  const thumbSize = getThumbSize();
  const thumbOffset = trackWidth - thumbSize - 4;

  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, thumbOffset],
  });

  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <Pressable onPress={handleToggle} disabled={disabled}>
        <View style={styles.switchContainer}>
          <Animated.View
            style={[
              styles.track,
              styles[`track${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles],
              { backgroundColor: trackColor },
            ]}
          />
          <Animated.View
            style={[
              styles.thumb,
              styles[`thumb${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles],
              { transform: [{ translateX: thumbTranslateX }] },
            ]}
          />
        </View>
      </Pressable>
    </View>
  );
};
