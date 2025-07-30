import React, { useEffect, useRef } from 'react';
import { View, Animated, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../atoms/Typography';
import { ToastProps } from './Toast.types';
import { styles } from './Toast.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  position = 'top',
  onDismiss,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return theme.colors.status.success;
      case 'error':
        return theme.colors.status.error;
      case 'warning':
        return theme.colors.status.warning;
      default:
        return theme.colors.status.info;
    }
  };

  useEffect(() => {
    if (visible) {
      logEvent(Events.TOAST_SHOWN, { type, message });
      
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      if (duration > 0) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: position === 'top' ? -100 : 100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, duration, position]);

  const handleDismiss = () => {
    onDismiss?.();
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        styles[type],
        position === 'top' 
          ? { top: insets.top + theme.spacing.md }
          : { bottom: insets.bottom + theme.spacing.md },
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Pressable style={styles.content} onPress={handleDismiss}>
        <Ionicons
          name={getIcon() as any}
          size={20}
          color={getIconColor()}
          style={styles.icon}
        />
        
        <Typography
          variant="body"
          color="primary"
          style={styles.message}
        >
          {message}
        </Typography>
      </Pressable>
    </Animated.View>
  );
};
