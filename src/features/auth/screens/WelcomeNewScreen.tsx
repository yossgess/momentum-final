import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Image } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../../shared/types/navigation';
import { Typography } from '../../../components/atoms/Typography';
import { theme } from '../../../theme';
import { t } from '../../../shared/utils/i18n';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { useAuthStore } from '../../../shared/stores/authStore';
import { profilesService } from '../../../shared/services/profilesService';

type WelcomeNewScreenRouteProp = RouteProp<RootStackParamList, 'WelcomeNew'>;
type WelcomeNewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WelcomeNew'>;

interface Props {
  route: WelcomeNewScreenRouteProp;
}

export const WelcomeNewScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<WelcomeNewScreenNavigationProp>();
  const { user } = useAuthStore();
  const [userName, setUserName] = useState<string>('there');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Fetch user's real name from profile
  useEffect(() => {
    const fetchUserName = async () => {
      if (user?.id) {
        try {
          const profile = await profilesService.getProfile(user.id);
          if (profile?.full_name) {
            setUserName(profile.full_name.split(' ')[0]); // Use first name
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Fallback to email-based name
          setUserName(user.email?.split('@')[0] || 'there');
        }
      }
    };
    
    fetchUserName();
  }, [user]);

  useEffect(() => {
    // Log screen view
    logEvent(Events.SCREEN_VIEWED, { 
      screenName: 'WelcomeNew',
      userName: userName 
    });

    // Start animations sequence
    const animationSequence = Animated.sequence([
      // Fade in and scale up main content
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Delay before showing button
      Animated.delay(500),
      // Fade in button
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    animationSequence.start();

    // Auto-navigate after 6 seconds
    const timer = setTimeout(() => {
      handleAutoNavigate();
    }, 6000);

    return () => clearTimeout(timer);
  }, [userName]);

  const handleAutoNavigate = () => {
    logEvent(Events.BUTTON_PRESSED, { 
      buttonName: 'WelcomeNewAutoNavigate',
      trigger: 'auto',
      userName: userName 
    });
    
    navigation.navigate('Main', { 
      screen: 'Discovery',
      params: { screen: 'DiscoveryScreen' }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.welcomeContent}>
          {/* Welcome Illustration */}
          <View style={styles.illustrationContainer}>
            <Image 
              source={require('../../../../assets/illustrations/welcome.png')}
              style={styles.welcomeIllustration}
              resizeMode="contain"
            />
          </View>

          {/* Animated Welcome Text */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateY: slideAnim }]
            }}
          >
            <Typography 
              variant="h2" 
              style={styles.welcomeTitle}
            >
              {t('welcome.newUser.title')}
            </Typography>

            <Typography 
              variant="h2" 
              style={styles.userNameText}
            >
              {userName} !
            </Typography>
          </Animated.View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            <Typography 
              variant="body" 
              style={styles.welcomeSubtitle}
            >
              {t('welcome.newUser.subtitle')}
            </Typography>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.autoNavigateText,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Typography 
              variant="caption" 
              style={styles.autoNavigateCaption}
            >
              {t('welcome.newUser.autoNavigate')}
            </Typography>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing['2xl'],
    paddingVertical: theme.spacing['3xl'],
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 360,
    paddingHorizontal: theme.spacing.lg,
  },
  illustrationContainer: {
    marginBottom: theme.spacing['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.xl,
  },
  welcomeIllustration: {
    width: 240,
    height: 240,
  },
  welcomeTitle: {
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    fontWeight: '700',
  },
  userNameText: {
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    fontWeight: '700',
    color: theme.colors.primary.main,
  },
  welcomeSubtitle: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  autoNavigateText: {
    marginTop: theme.spacing['2xl'],
    alignItems: 'center',
  },
  autoNavigateCaption: {
    textAlign: 'center',
    color: theme.colors.text.tertiary,
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: theme.spacing.xl,
  },
  continueButton: {
    marginTop: theme.spacing.lg,
  },
});
