import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Typography } from '../../../components/atoms/Typography';
import { Button } from '../../../components/atoms/Button';
import { Input } from '../../../components/atoms/Input';
import { theme } from '../../../theme';
import { t } from '../../../shared/utils/i18n';
import { useAuthStore } from '../../../shared/stores/authStore';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { AuthStackParamList } from '../../../shared/types/navigation';

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
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      await signup(email, password, userType);
      logEvent(Events.SIGNUP_SUCCESS, { email, userType });
    } catch (error) {
      logEvent(Events.SIGNUP_FAILED, { email, userType, error: String(error) });
      Alert.alert('Signup Failed', 'Please try again.');
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
    <ScrollView 
      contentContainerStyle={styles.container}
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

        <Input
          label={t('auth.email')}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={errors.email}
        />

        <Input
          label={t('auth.password')}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry
          error={errors.confirmPassword}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl, // Added vertical padding for better distribution
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
