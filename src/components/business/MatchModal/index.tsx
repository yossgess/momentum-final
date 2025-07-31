import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
// Conditional imports with fallbacks
let Image: any;
let LinearGradient: any;
let Haptics: any;
let Zap: any;
let X: any;

try {
  Image = require('expo-image').Image;
} catch {
  Image = require('react-native').Image;
}

try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch {
  // Fallback to a simple View
  LinearGradient = require('react-native').View;
}

try {
  Haptics = require('expo-haptics');
} catch {
  // Mock haptics for web/missing dependency
  Haptics = {
    impactAsync: () => Promise.resolve(),
    notificationAsync: () => Promise.resolve(),
    ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
    NotificationFeedbackType: { Success: 'success' }
  };
}

try {
  const lucide = require('lucide-react-native');
  Zap = lucide.Zap;
  X = lucide.X;
} catch {
  // Fallback to react-native-vector-icons or simple text
  try {
    const VectorIcons = require('react-native-vector-icons/Feather');
    Zap = (props: any) => React.createElement(VectorIcons.default, { name: 'zap', ...props });
    X = (props: any) => React.createElement(VectorIcons.default, { name: 'x', ...props });
  } catch {
    // Ultimate fallback to text
    Zap = ({ size, color }: any) => React.createElement(require('react-native').Text, { style: { fontSize: size, color } }, '⚡');
    X = ({ size, color }: any) => React.createElement(require('react-native').Text, { style: { fontSize: size, color } }, '×');
  }
}
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Typography } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';
import { MatchModalProps } from './MatchModal.types';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { t } from '../../../shared/utils/i18n';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const AVATAR_SIZE = SCREEN_WIDTH * 0.35;
const LIGHTNING_SIZE = 60;

export const MatchModal: React.FC<MatchModalProps> = ({
  visible,
  currentUser,
  matchedUser,
  onSendMessage,
  onKeepSwiping,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const lightningScale = useRef(new Animated.Value(0)).current;
  const lightningRotate = useRef(new Animated.Value(0)).current;
  const avatarsScale = useRef(new Animated.Value(0.8)).current;
  const buttonsTranslateY = useRef(new Animated.Value(100)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  
  const [animationComplete, setAnimationComplete] = useState(false);

  // Get shared sports between users
  const getSharedSports = () => {
    if (!currentUser.sports || !matchedUser.sports) return [];
    
    const currentUserSports = currentUser.sports.map(sport => sport.name.toLowerCase());
    const matchedUserSports = matchedUser.sports.map(sport => sport.name.toLowerCase());
    
    return currentUser.sports.filter(sport => 
      matchedUserSports.includes(sport.name.toLowerCase())
    ).map(sport => sport.name);
  };

  const sharedSports = getSharedSports();

  const handleSendMessage = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    logEvent('MatchModal_SendMessage_Clicked', { 
      matchedUserId: matchedUser.id,
      sharedSportsCount: sharedSports.length
    });
    onSendMessage();
  };

  const handleKeepSwiping = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    logEvent('MatchModal_KeepSwiping_Clicked', { 
      matchedUserId: matchedUser.id,
      sharedSportsCount: sharedSports.length
    });
    onKeepSwiping();
  };

  const handleClose = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    logEvent('MatchModal_Closed', { 
      matchedUserId: matchedUser.id,
      timeSpent: Date.now() // Could track actual time spent
    });
    onClose();
  };

  useEffect(() => {
    if (visible) {
      // Trigger haptic feedback on match
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Reset animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.3);
      slideAnim.setValue(50);
      lightningScale.setValue(0);
      lightningRotate.setValue(0);
      avatarsScale.setValue(0.8);
      buttonsTranslateY.setValue(100);
      buttonsOpacity.setValue(0);
      setAnimationComplete(false);

      // Start animation sequence
      const animationSequence = Animated.sequence([
        // Initial fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        
        // Scale and slide main content
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        
        // Animate avatars
        Animated.spring(avatarsScale, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        
        // Lightning bolt animation
        Animated.parallel([
          Animated.spring(lightningScale, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(lightningRotate, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        
        // Buttons appear
        Animated.parallel([
          Animated.spring(buttonsTranslateY, {
            toValue: 0,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(buttonsOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]);

      animationSequence.start(() => {
        setAnimationComplete(true);
      });
    }
  }, [visible]);

  if (!visible) return null;

  const lightningRotateInterpolate = lightningRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <StatusBar backgroundColor="transparent" barStyle="light-content" />
      
      <Animated.View 
        style={[
          {
            flex: 1,
            backgroundColor: theme.colors.overlay.darker,
          },
          {
            opacity: fadeAnim,
          }
        ]}
      >
        {/* Background Gradient */}
        <LinearGradient
          colors={[
            theme.colors.background.primary,
            theme.colors.primary.dark,
            theme.colors.background.primary,
          ]}
          locations={[0, 0.5, 1]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        
        {/* Close Button */}
        <Pressable
          onPress={handleClose}
          style={{
            position: 'absolute',
            top: insets.top + theme.spacing.md,
            right: theme.spacing.md,
            zIndex: 10,
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.colors.overlay.medium,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <X size={24} color={theme.colors.text.primary} />
        </Pressable>

        {/* Main Content */}
        <Animated.View
          style={[
            {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: theme.spacing.lg,
            },
            {
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim },
              ],
            }
          ]}
        >
          {/* Title */}
          <Typography
            variant="h1"
            style={{
              fontSize: theme.typography.fontSize['4xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              textAlign: 'center',
              marginBottom: theme.spacing.xs,
              letterSpacing: 2,
            }}
          >
            {t('match.challengeAccepted')}
          </Typography>

          <Typography
            variant="body"
            style={{
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.text.secondary,
              textAlign: 'center',
              marginBottom: theme.spacing['3xl'],
            }}
          >
            {t('match.perfectMatch')}
          </Typography>

          {/* Avatar Section */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: theme.spacing['2xl'],
              width: '100%',
            }}
          >
            {/* Current User Avatar */}
            <Animated.View
              style={{
                transform: [{ scale: avatarsScale }],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  borderRadius: AVATAR_SIZE / 2,
                  borderWidth: 4,
                  borderColor: theme.colors.primary.main,
                  overflow: 'hidden',
                  shadowColor: theme.colors.shadow.dark,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  source={currentUser.photos?.[0] ? { uri: currentUser.photos[0] } : { uri: 'https://via.placeholder.com/150x150/00A89D/FFFFFF?text=User' }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  {...(Image.displayName === 'ExpoImage' ? { contentFit: 'cover' } : { resizeMode: 'cover' })}
                />
              </View>
              
              {/* Current User Name */}
              <Typography
                variant="body"
                style={{
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text.primary,
                  textAlign: 'center',
                  marginTop: theme.spacing.sm,
                }}
              >
                {currentUser.firstName}
              </Typography>
            </Animated.View>

            {/* Lightning Bolt */}
            <Animated.View
              style={{
                marginHorizontal: theme.spacing.lg,
                transform: [
                  { scale: lightningScale },
                  { rotate: lightningRotateInterpolate },
                ],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: LIGHTNING_SIZE,
                  height: LIGHTNING_SIZE,
                  borderRadius: LIGHTNING_SIZE / 2,
                  backgroundColor: theme.colors.primary.main,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: theme.colors.primary.main,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6,
                  shadowRadius: 20,
                  elevation: 10,
                }}
              >
                <Zap size={32} color={theme.colors.text.primary} fill={theme.colors.text.primary} />
              </View>
            </Animated.View>

            {/* Matched User Avatar */}
            <Animated.View
              style={{
                transform: [{ scale: avatarsScale }],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  borderRadius: AVATAR_SIZE / 2,
                  borderWidth: 4,
                  borderColor: theme.colors.primary.main,
                  overflow: 'hidden',
                  shadowColor: theme.colors.shadow.dark,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  source={matchedUser.photos?.[0] ? { uri: matchedUser.photos[0] } : { uri: 'https://via.placeholder.com/150x150/00A89D/FFFFFF?text=User' }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  {...(Image.displayName === 'ExpoImage' ? { contentFit: 'cover' } : { resizeMode: 'cover' })}
                />
              </View>
              
              {/* Matched User Name */}
              <Typography
                variant="body"
                style={{
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text.primary,
                  textAlign: 'center',
                  marginTop: theme.spacing.sm,
                }}
              >
                {matchedUser.firstName}
              </Typography>
            </Animated.View>
          </View>



          {/* Shared Sports */}
          {sharedSports.length > 0 && (
            <View
              style={{
                marginBottom: theme.spacing['2xl'],
                alignItems: 'center',
              }}
            >
              <Typography
                variant="body"
                style={{
                  fontSize: theme.typography.fontSize.base,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.xs,
                }}
              >
                {t('match.youBothLove')}
              </Typography>
              <Typography
                variant="body"
                style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.primary.light,
                  textAlign: 'center',
                }}
              >
                {sharedSports.join(', ')}
              </Typography>
            </View>
          )}

          {/* Action Buttons */}
          <Animated.View
            style={[
              {
                width: '100%',
                paddingHorizontal: theme.spacing.md,
              },
              {
                transform: [{ translateY: buttonsTranslateY }],
                opacity: buttonsOpacity,
              }
            ]}
          >
            <Button
              variant="primary"
              onPress={handleSendMessage}
              style={{
                marginBottom: theme.spacing.md,
                paddingVertical: theme.spacing.md,
                borderRadius: theme.borderRadius.xl,
                shadowColor: theme.colors.primary.main,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Typography
                variant="button"
                style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text.primary,
                }}
              >
                {t('match.sendMessage')}
              </Typography>
            </Button>
            
            <Pressable
              onPress={handleKeepSwiping}
              style={{
                paddingVertical: theme.spacing.md,
                alignItems: 'center',
              }}
            >
              <Typography
                variant="body"
                style={{
                  fontSize: theme.typography.fontSize.base,
                  color: theme.colors.text.secondary,
                  textDecorationLine: 'underline',
                }}
              >
                {t('match.keepSwiping')}
              </Typography>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
