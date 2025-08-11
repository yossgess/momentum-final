import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import { Typography } from '../../../components/atoms/Typography';
import { Button } from '../../../components/atoms/Button';
import { InputField } from '../../../components/atoms/InputField';

// Utils & Types
import { theme } from '../../../theme';
import { t } from '../../../shared/utils/i18n';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { AuthStackParamList } from '../../../shared/types/navigation';
import { authService } from '../../../shared/services/authService';
import { AuthValidation } from '../../../shared/utils/authValidation';

type PasswordResetScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'PasswordReset'>;

export const PasswordResetScreen: React.FC = () => {
  const navigation = useNavigation<PasswordResetScreenNavigationProp>();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string>('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  useEffect(() => {
    logEvent(Events.SCREEN_VIEWED, { screenName: 'PasswordReset' });
  }, []);

  const handleSendResetLink = async () => {
    // Validate email
    const validation = AuthValidation.validateEmail(email);
    if (!validation.isValid) {
      setEmailError(validation.error || '');
      return;
    }

    setIsLoading(true);
    setEmailError('');
    logEvent(Events.BUTTON_PRESSED, { buttonName: 'SendPasswordReset', email });

    try {
      await authService.resetPassword(email);
      setIsEmailSent(true);
      logEvent(Events.PASSWORD_RESET_REQUESTED, { email });
      
      Alert.alert(
        t('auth.passwordReset.success'),
        t('auth.passwordReset.success')
      );
    } catch (error) {
      const errorMessage = AuthValidation.parseAuthError(error);
      setEmailError(errorMessage);
      logEvent(Events.SIGNUP_FAILED, { email, error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    navigation.navigate('SignIn');
    logEvent(Events.BUTTON_PRESSED, { buttonName: 'BackToSignIn' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h2" color={theme.colors.text.primary} style={styles.title}>
            {t('auth.passwordReset.title')}
          </Typography>
          
          <Typography 
            variant="body" 
            color={theme.colors.text.secondary} 
            style={styles.message}
          >
            {t('auth.passwordReset.message')}
          </Typography>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <InputField
            label={t('auth.email')}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
              setIsEmailSent(false);
            }}
            placeholder={t('auth.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            errorText={emailError}
            disabled={isLoading}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSendResetLink}
            loading={isLoading}
            disabled={!email.trim() || isEmailSent}
            style={styles.sendButton}
          >
            {isEmailSent ? t('auth.emailConfirmation.resendSuccess') : t('auth.passwordReset.send')}
          </Button>

          <Button
            variant="ghost"
            size="md"
            fullWidth
            onPress={handleBackToSignIn}
            style={styles.backButton}
          >
            {t('auth.passwordReset.backToSignIn')}
          </Button>
        </View>

        {/* Success Message */}
        {isEmailSent && (
          <View style={styles.successContainer}>
            <Typography 
              variant="body" 
              color={theme.colors.primary.main} 
              style={styles.successText}
            >
              {t('auth.passwordReset.success')}
            </Typography>
          </View>
        )}
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing['3xl'],
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  message: {
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: theme.spacing['2xl'],
  },
  actions: {
    gap: theme.spacing.md,
  },
  sendButton: {
    marginBottom: theme.spacing.sm,
  },
  backButton: {
    marginTop: theme.spacing.md,
  },
  successContainer: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  successText: {
    textAlign: 'center',
    fontWeight: '600',
  },
});
