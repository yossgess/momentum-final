import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Typography } from '../../../components/atoms/Typography';
import { Button } from '../../../components/atoms/Button';
import { theme } from '../../../theme';
import { t } from '../../../shared/utils/i18n';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { AuthStackParamList } from '../../../shared/types/navigation';

const { width: screenWidth } = Dimensions.get('window');

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  React.useEffect(() => {
    logEvent(Events.SCREEN_VIEWED, { screenName: 'Welcome' });
  }, []);

  const handleLogin = () => {
    logEvent(Events.BUTTON_PRESSED, { buttonName: 'SignIn' });
    navigation.navigate('SignIn');
  };

  const handleSignup = () => {
    logEvent(Events.SIGNUP_ATTEMPTED, { source: 'welcome_screen' });
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.textContainer}>
          <Typography 
            variant="body" 
            color={theme.colors.text.secondary} 
            align="center"
            style={styles.subtitle}
          >
            Your Hub for Sports Connection
          </Typography>

          <Typography 
            variant="body" 
            color={theme.colors.text.tertiary} 
            align="center"
            style={styles.description}
          >
            Connect with sports enthusiasts, find coaches, and join events in your area
          </Typography>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleSignup}
          style={styles.button}
        >
          {t('auth.signup')}
        </Button>

        <Button
          variant="outline"
          size="lg"
          fullWidth
          onPress={handleLogin}
          style={styles.button}
        >
          {t('auth.login')}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 300, // Fixed size instead of dynamic calculation
    height: 300,
    aspectRatio: 1, // Maintain aspect ratio
  },
  textContainer: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing['2xl'],
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    width: '100%',
  },
  subtitle: {
    marginBottom: theme.spacing.md,
  },
  description: {
    marginBottom: theme.spacing.lg,
  },
  buttonContainer: {
    gap: theme.spacing.md,
    marginTop: 'auto',
  },
  button: {
    marginBottom: theme.spacing.sm,
  },
});
