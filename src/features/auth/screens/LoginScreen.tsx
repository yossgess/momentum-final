import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
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

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  React.useEffect(() => {
    logEvent(Events.SCREEN_VIEWED, { screenName: 'Login' });
  }, []);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(email, password);
      logEvent(Events.LOGIN_SUCCESS, { email });
    } catch (error) {
      logEvent(Events.LOGIN_FAILED, { email, error: String(error) });
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
    }
  };

  const handleSignupNavigation = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2" color={theme.colors.text.primary} align="center">
          {t('auth.login')}
        </Typography>
        
        <Typography 
          variant="body" 
          color={theme.colors.text.secondary} 
          align="center"
          style={styles.subtitle}
        >
          Welcome back to Momentum
        </Typography>
      </View>

      <View style={styles.form}>
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

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleLogin}
          loading={isLoading}
          style={styles.loginButton}
        >
          {t('auth.login')}
        </Button>

        <Button
          variant="ghost"
          size="md"
          fullWidth
          onPress={handleSignupNavigation}
        >
          Don't have an account? {t('auth.signup')}
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
    paddingTop: theme.spacing['3xl'],
  },
  header: {
    marginBottom: theme.spacing['2xl'],
  },
  subtitle: {
    marginTop: theme.spacing.md,
  },
  form: {
    flex: 1,
  },
  loginButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
});
