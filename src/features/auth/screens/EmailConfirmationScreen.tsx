import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
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

type EmailConfirmationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'EmailConfirmation'>;
type EmailConfirmationScreenRouteProp = RouteProp<AuthStackParamList, 'EmailConfirmation'>;

export const EmailConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<EmailConfirmationScreenNavigationProp>();
  const route = useRoute<EmailConfirmationScreenRouteProp>();
  
  const [email, setEmail] = useState(route.params?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string>('');

  useEffect(() => {
    logEvent(Events.SCREEN_VIEWED, { screenName: 'EmailConfirmation' });
  }, []);

  const handleResendEmail = async () => {
    if (!email) return;

    setIsLoading(true);
    logEvent(Events.BUTTON_PRESSED, { buttonName: 'ResendConfirmation', email });

    try {
      await authService.resendConfirmation(email);
      Alert.alert(
        t('auth.emailConfirmation.resendSuccess'),
        t('auth.emailConfirmation.message').replace('{{email}}', email)
      );
      logEvent(Events.EMAIL_CONFIRMATION_RESENT, { email });
    } catch (error) {
      const errorMessage = AuthValidation.parseAuthError(error);
      Alert.alert('Error', errorMessage);
      logEvent(Events.EMAIL_CONFIRMATION_FAILED, { email, error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setIsChangingEmail(true);
    setEmailError('');
  };

  const handleUpdateEmail = async () => {
    const validation = AuthValidation.validateEmail(email);
    if (!validation.isValid) {
      setEmailError(validation.error || '');
      return;
    }

    setIsLoading(true);
    logEvent(Events.BUTTON_PRESSED, { buttonName: 'UpdateEmail', newEmail: email });

    try {
      // Update email and resend confirmation
      await authService.updateEmail(email);
      await authService.resendConfirmation(email);
      
      setIsChangingEmail(false);
      setEmailError('');
      
      Alert.alert(
        t('auth.emailConfirmation.resendSuccess'),
        t('auth.emailConfirmation.message').replace('{{email}}', email)
      );
      
      logEvent(Events.EMAIL_UPDATED, { newEmail: email });
    } catch (error) {
      const errorMessage = AuthValidation.parseAuthError(error);
      setEmailError(errorMessage);
      logEvent(Events.EMAIL_UPDATE_FAILED, { newEmail: email, error: errorMessage });
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
            {t('auth.emailConfirmation.title')}
          </Typography>
          
          <Typography 
            variant="body" 
            color={theme.colors.text.secondary} 
            style={styles.message}
          >
            {t('auth.emailConfirmation.message').replace('{{email}}', email)}
          </Typography>
        </View>

        {/* Email Change Section */}
        {isChangingEmail ? (
          <View style={styles.emailChangeContainer}>
            <InputField
              label={t('auth.email')}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
              placeholder={t('auth.emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              errorText={emailError}
            />
            
            <View style={styles.emailChangeButtons}>
              <Button
                variant="outline"
                size="md"
                onPress={() => setIsChangingEmail(false)}
                style={styles.cancelButton}
              >
                {t('common.cancel')}
              </Button>
              
              <Button
                variant="primary"
                size="md"
                onPress={handleUpdateEmail}
                loading={isLoading}
                style={styles.updateButton}
              >
                {t('common.save')}
              </Button>
            </View>
          </View>
        ) : (
          <View style={styles.emailDisplay}>
            <Typography variant="body" color={theme.colors.text.primary} style={styles.emailText}>
              {email}
            </Typography>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleResendEmail}
            loading={isLoading}
            style={styles.resendButton}
          >
            {t('auth.emailConfirmation.resend')}
          </Button>

          {!isChangingEmail && (
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onPress={handleChangeEmail}
              style={styles.changeEmailButton}
            >
              {t('auth.emailConfirmation.changeEmail')}
            </Button>
          )}

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
  emailDisplay: {
    alignItems: 'center',
    marginBottom: theme.spacing['2xl'],
  },
  emailText: {
    fontWeight: '600',
    fontSize: 16,
  },
  emailChangeContainer: {
    marginBottom: theme.spacing['2xl'],
  },
  emailChangeButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  cancelButton: {
    flex: 1,
  },
  updateButton: {
    flex: 1,
  },
  actions: {
    gap: theme.spacing.md,
  },
  resendButton: {
    marginBottom: theme.spacing.sm,
  },
  changeEmailButton: {
    marginBottom: theme.spacing.sm,
  },
  backButton: {
    marginTop: theme.spacing.md,
  },
});
