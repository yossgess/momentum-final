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

type WelcomeBackScreenRouteProp = RouteProp<RootStackParamList, 'WelcomeBack'>;
type WelcomeBackScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WelcomeBack'>;

interface Props {
  route: WelcomeBackScreenRouteProp;
}

export const WelcomeBackScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<WelcomeBackScreenNavigationProp>();
  const { user } = useAuthStore();
  const [userName, setUserName] = useState<string>('there');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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
    logEvent(Events.SCREEN_VIEWED, { screenName: 'WelcomeBack', userName });

    // Start animations sequence
    const animationSequence = Animated.sequence([
      // Fade in and scale up main content
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]),
      // Delay before showing button
      Animated.delay(300),
      // Fade in button
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    // Pulse animation for welcome icon
    const pulseSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    animationSequence.start();
    
    // Start pulse after main animation
    setTimeout(() => {
      pulseSequence.start();
    }, 800);

    // Auto-navigate after 6 seconds
    const timer = setTimeout(() => {
      handleAutoNavigate();
    }, 6000);

    return () => clearTimeout(timer);
  }, [userName]);

  const handleAutoNavigate = () => {
    logEvent(Events.BUTTON_PRESSED, { 
      buttonName: 'WelcomeBackAutoNavigate',
      trigger: 'auto',
      userName: userName 
    });
    
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const handleContinue = () => {
    logEvent(Events.BUTTON_PRESSED, { 
      buttonName: 'WelcomeBackContinue',
      userName,
      trigger: 'manual'
    });
    
    // Navigate to main app
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Main Welcome Content */}
        <View style={styles.welcomeContent}>
          {/* Welcome Illustration */}
          <Animated.View 
            style={[
              styles.illustrationContainer,
              {
                transform: [{ scale: pulseAnim }]
              }
            ]}
          >
            <Image 
              source={require('../../../../assets/illustrations/welcome.png')}
              style={styles.welcomeIllustration}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Animated Welcome Text */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }}
          >
            <Typography 
              variant="h2" 
              style={styles.welcomeTitle}
            >
              {t('welcome.returningUser.title')}
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
              transform: [{ scale: scaleAnim }]
            }}
          >
            <Typography 
              variant="body" 
              style={styles.welcomeSubtitle}
            >
              {t('welcome.returningUser.subtitle')}
            </Typography>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.autoNavigateText,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <Typography 
              variant="caption" 
              style={styles.autoNavigateCaption}
            >
              {t('welcome.returningUser.autoNavigate')}
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
