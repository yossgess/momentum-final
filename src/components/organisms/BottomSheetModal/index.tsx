import React, { useRef, useEffect } from 'react';
import { View, Modal, Pressable, Animated, Dimensions, PanResponder } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '../../atoms/Typography';
import { BottomSheetModalProps } from './BottomSheetModal.types';
import { styles } from './BottomSheetModal.styles';
import { logEvent, Events } from '../../../shared/utils/analytics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  visible,
  title,
  snapPoints = ['50%'],
  children,
  onClose,
  enableBackdropDismiss = true,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const snapPointHeight = snapPoints[0].includes('%') 
    ? (SCREEN_HEIGHT * parseInt(snapPoints[0]) / 100)
    : parseInt(snapPoints[0]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > snapPointHeight * 0.3) {
          handleClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      logEvent(Events.MODAL_OPENED, { title });
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    logEvent(Events.MODAL_CLOSED, { title });
    onClose();
  };

  const handleBackdropPress = () => {
    if (enableBackdropDismiss) {
      handleClose();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={styles.backdropPressable} onPress={handleBackdropPress} />
      </Animated.View>

      <Animated.View
        style={[
          styles.container,
          {
            height: snapPointHeight + insets.bottom,
            paddingBottom: insets.bottom,
            transform: [{ translateY }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />
        
        {title && (
          <View style={styles.header}>
            <Typography variant="h3" color="primary">
              {title}
            </Typography>
          </View>
        )}
        
        <View style={styles.content}>
          {children}
        </View>
      </Animated.View>
    </Modal>
  );
};
