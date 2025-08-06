import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';

// Complete auth session for OAuth redirects
WebBrowser.maybeCompleteAuthSession();

// Components
import { Typography } from '../../../components/atoms/Typography';
import { Button } from '../../../components/atoms/Button';
import { InputField } from '../../../components/atoms/InputField';
import { Divider } from '../../../components/atoms/Divider';

// Utils & Types
import { theme } from '../../../theme';
import { t } from '../../../shared/utils/i18n';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { AuthStackParamList } from '../../../shared/types/navigation';
import { supabase } from '../../../config/supabase';

// Mock data for testing
const MOCK_EMAIL = "test.sofia@momentum.app";
const MOCK_PASSWORD = "testpass123";

type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;

export const SignInScreen: React.FC = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Screen analytics
  useEffect(() => {
    logEvent(Events.SCREEN_VIEWED, { screenName: 'SignIn' });
  }, []);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sign in handler
  const handleSignIn = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    logEvent(Events.BUTTON_PRESSED, { 
      buttonName: 'SignIn',
      email: email 
    });

    try {
      const { useAuthStore } = await import('../../../shared/stores/authStore');
      await useAuthStore.getState().login(email, password);
      logEvent(Events.LOGIN_SUCCESS, { email });
    } catch (error) {
      logEvent(Events.LOGIN_FAILED, { 
        email, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      
      Alert.alert(
        'Sign In Failed', 
        error instanceof Error ? error.message : t('auth.errorInvalidCredentials')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
    try {
      setIsLoading(true);
      
      // Log analytics event for OAuth attempt
      logEvent(Events.LOGIN_ATTEMPTED, { provider });
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: 'exp://127.0.0.1:8081', // This should match Expo Go dev URL
        },
      });

      if (error) {
        console.error('OAuth sign-in error:', error.message);
        logEvent(Events.LOGIN_FAILED, { provider, error: error.message });
        Alert.alert('Error', `Failed to sign in with ${provider}. Please try again.`);
        return;
      }

      if (data?.url) {
        // Open the OAuth URL in the system browser
        const result = await WebBrowser.openAuthSessionAsync(
          data.url, 
          'exp://127.0.0.1:8081'
        );
        
        // Log the result for debugging
        console.log('OAuth browser result:', result);
        
        // The auth state change will be handled by the auth store listener
        // Log success analytics event
        logEvent(Events.LOGIN_SUCCESS, { provider });
      }
    } catch (error) {
      console.error('OAuth sign-in error:', error);
      logEvent(Events.LOGIN_FAILED, { 
        provider, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      Alert.alert('Error', `Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to Sign Up
  const handleSignUpNavigation = () => {
    logEvent(Events.BUTTON_PRESSED, { buttonName: 'GoToSignUp' });
    navigation.navigate('Signup');
  };

  // Forgot password handler
  const handleForgotPassword = () => {
    logEvent(Events.BUTTON_PRESSED, { buttonName: 'ForgotPassword' });
    Alert.alert(
      'Forgot Password', 
      'Password reset functionality will be implemented with Supabase integration.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Typography 
            variant="h1" 
            color={theme.colors.text.primary}
            style={styles.title}
          >
            {t('auth.welcomeBack')}
          </Typography>
          
          <Typography 
            variant="body" 
            color={theme.colors.text.secondary}
            style={styles.subtitle}
          >
            {t('auth.subtitle')}
          </Typography>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          {/* Email Input */}
          <InputField
            variant="default"
            label={t('auth.email')}
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            errorText={errors.email}
            leftIcon="mail-outline"
          />

          {/* Password Input */}
          <View style={styles.passwordContainer}>
            <InputField
              variant="password"
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChangeText={setPassword}
              errorText={errors.password}
              leftIcon="lock-closed-outline"
            />
            
            {/* Forgot Password Link */}
            <Button
              variant="ghost"
              size="sm"
              onPress={handleForgotPassword}
              style={styles.forgotPasswordButton}
            >
              <Typography 
                variant="caption" 
                color={theme.colors.primary.main}
              >
                {t('auth.forgotPassword')}
              </Typography>
            </Button>
          </View>

          {/* Sign In Button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            onPress={handleSignIn}
            style={styles.signInButton}
          >
            {isLoading ? t('auth.loading') : t('auth.signIn')}
          </Button>

          {/* OAuth Buttons */}
          <View style={styles.oauthContainer}>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onPress={() => handleOAuthSignIn('google')}
              loading={isLoading}
              style={styles.oauthButton}
            >
              Continue with Google
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onPress={() => handleOAuthSignIn('facebook')}
              loading={isLoading}
              style={styles.oauthButton}
            >
              Continue with Facebook
            </Button>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <Divider />
          </View>

          {/* Sign Up Navigation */}
          <View style={styles.signUpContainer}>
            <Typography 
              variant="body" 
              color={theme.colors.text.secondary}
              style={styles.signUpText}
            >
              {t('auth.noAccount')}{' '}
            </Typography>
            <Button
              variant="ghost"
              size="md"
              onPress={handleSignUpNavigation}
              style={styles.signUpButton}
            >
              <Typography 
                variant="body" 
                color={theme.colors.primary.main}
                style={styles.signUpLinkText}
              >
                {t('auth.signUp')}
              </Typography>
            </Button>
          </View>
        </View>

        {/* Development Helper */}
        {__DEV__ && (
          <View style={styles.devHelper}>
            <Typography variant="caption" color={theme.colors.text.tertiary}>
              Dev: Use {MOCK_EMAIL} / {MOCK_PASSWORD}
            </Typography>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing['3xl'],
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  passwordContainer: {
    marginTop: theme.spacing.lg,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: theme.spacing.sm,
    paddingHorizontal: 0,
    paddingVertical: theme.spacing.xs,
  },
  signInButton: {
    marginTop: theme.spacing['2xl'],
    marginBottom: theme.spacing.lg,
  },
  dividerContainer: {
    marginVertical: theme.spacing.lg,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
  },
  signUpText: {
    textAlign: 'center',
  },
  signUpButton: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 0,
    minHeight: 'auto',
  },
  signUpLinkText: {
    fontWeight: '600',
  },
  devHelper: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  oauthContainer: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  oauthButton: {
    marginBottom: theme.spacing.sm,
  },
});
