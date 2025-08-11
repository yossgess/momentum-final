import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../../components/atoms/Typography';
import { Button } from '../../../components/atoms/Button';
import { InputField } from '../../../components/atoms/InputField';
import { PasswordStrengthIndicator } from '../../../components/atoms/PasswordStrengthIndicator';
import { theme } from '../../../theme';
import { t } from '../../../shared/utils/i18n';
import { useAuthStore } from '../../../shared/stores/authStore';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { AuthStackParamList } from '../../../shared/types/navigation';
import { AuthValidation } from '../../../shared/utils/authValidation';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

export const SignupScreen: React.FC = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { signup, signInWithOAuth, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // MVP: Default to enthusiast only, no user type selection
  const userType = 'enthusiast';
  const [errors, setErrors] = useState<{ 
    email?: string; 
    password?: string; 
    confirmPassword?: string; 
  }>({});

  React.useEffect(() => {
    logEvent(Events.SCREEN_VIEWED, { screenName: 'Signup' });
  }, []);

  const validateForm = () => {
    const newErrors: { 
      email?: string; 
      password?: string; 
      confirmPassword?: string; 
    } = {};
    
    // Email validation
    const emailValidation = AuthValidation.validateEmail(email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }
    
    // Password validation
    const passwordValidation = AuthValidation.validatePassword(password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.feedback[0] || t('auth.errors.passwordTooWeak');
    }
    
    // Password confirmation validation
    const confirmValidation = AuthValidation.validatePasswordConfirmation(password, confirmPassword);
    if (!confirmValidation.isValid) {
      newErrors.confirmPassword = confirmValidation.error;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      await signup(email, password, userType);
      
      // Navigate to email confirmation screen after successful signup
      navigation.navigate('EmailConfirmation', { email });
      logEvent(Events.SIGNUP_SUCCESS, { email, userType, requiresConfirmation: true });
    } catch (error) {
      const errorMessage = AuthValidation.parseAuthError(error);
      logEvent(Events.SIGNUP_FAILED, { email, userType, error: errorMessage });
      
      // Handle specific error cases
      if (errorMessage.includes('already exists')) {
        Alert.alert(
          t('auth.errors.emailAlreadyExists'),
          'Would you like to sign in instead?',
          [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('auth.signIn'), onPress: () => navigation.navigate('SignIn') },
          ]
        );
      } else {
        Alert.alert('Signup Failed', errorMessage);
      }
    }
  };

  const handleOAuthSignUp = async (provider: 'google' | 'facebook') => {
    try {
      const { signInWithOAuth } = useAuthStore.getState();
      await signInWithOAuth(provider);
      logEvent(Events.SIGNUP_SUCCESS, { provider, userType });
    } catch (error) {
      logEvent(Events.SIGNUP_FAILED, { provider, userType, error: String(error) });
      Alert.alert('Error', `Failed to sign up with ${provider}. Please try again.`);
    }
  };

  const handleLoginNavigation = () => {
    navigation.navigate('SignIn');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Typography variant="h2" color={theme.colors.text.primary} align="center">
            {t('auth.signup')}
          </Typography>
          
          <Typography 
            variant="body" 
            color={theme.colors.text.secondary} 
            align="center"
            style={styles.subtitle}
          >
            Join the Momentum community
          </Typography>
        </View>

      <View style={styles.form}>
        {/* MVP: User type selector removed - defaulting to sports enthusiast */}

        <InputField
          label={t('auth.email')}
          value={email}
          onChangeText={setEmail}
          placeholder={t('auth.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          leftIcon="mail"
          errorText={errors.email}
        />

        <View style={styles.passwordContainer}>
          <InputField
            label={t('auth.password')}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              // Clear password error when user starts typing
              if (errors.password) {
                setErrors(prev => ({ ...prev, password: undefined }));
              }
            }}
            placeholder={t('auth.passwordPlaceholder')}
            variant="password"
            leftIcon="lock-closed"
            errorText={errors.password}
          />
          
          {/* Password Strength Indicator */}
          <PasswordStrengthIndicator 
            password={password} 
            showFeedback={!!password && password.length > 0}
          />
        </View>

        <InputField
          label={t('auth.confirmPassword')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={t('auth.confirmPasswordPlaceholder')}
          variant="password"
          leftIcon="lock-closed"
          errorText={errors.confirmPassword}
        />

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleSignup}
          loading={isLoading}
          style={styles.signupButton}
        >
          {t('auth.signup')}
        </Button>

        <View style={styles.oauthContainer}>
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onPress={() => handleOAuthSignUp('google')}
            loading={isLoading}
            style={styles.oauthButton}
          >
            Continue with Google
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onPress={() => handleOAuthSignUp('facebook')}
            loading={isLoading}
            style={styles.oauthButton}
          >
            Continue with Facebook
          </Button>
        </View>

        <Button
          variant="ghost"
          size="md"
          fullWidth
          onPress={handleLoginNavigation}
        >
          Already have an account? {t('auth.login')}
        </Button>
      </View>
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
    marginBottom: theme.spacing['2xl'],
    paddingTop: theme.spacing['3xl'], // Increased top padding to move header down
  },
  subtitle: {
    marginTop: theme.spacing.md,
  },
  form: {
    flex: 1,
    justifyContent: 'center', // Center the form content vertically
    paddingVertical: theme.spacing.lg, // Added vertical padding to form
  },
  passwordContainer: {
    marginVertical: theme.spacing.md,
  },
  signupButton: {
    marginTop: theme.spacing['3xl'], // Increased for better separation
    marginBottom: theme.spacing.lg, // Increased bottom margin
  },
  oauthContainer: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  oauthButton: {
    marginBottom: theme.spacing.sm,
  },
});
