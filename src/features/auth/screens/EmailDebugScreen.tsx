import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import { Typography } from '../../../components/atoms/Typography';
import { Button } from '../../../components/atoms/Button';
import { InputField } from '../../../components/atoms/InputField';

// Utils & Services
import { theme } from '../../../theme';
import { t } from '../../../shared/utils/i18n';
import { emailDebugService } from '../../../shared/utils/emailDebug';
import { authService } from '../../../shared/services/authService';

export const EmailDebugScreen: React.FC = () => {
  const [email, setEmail] = useState('test@gmail.com');
  const [isLoading, setIsLoading] = useState(false);
  const [debugResults, setDebugResults] = useState<any>(null);

  const handleTestEmailFlow = async () => {
    setIsLoading(true);
    setDebugResults(null);

    try {
      console.log('🧪 Starting comprehensive email debug test...');
      const results = await emailDebugService.testEmailFlow(email);
      setDebugResults(results);
      
      Alert.alert(
        'Debug Test Complete',
        'Check the console for detailed results. Results are also displayed below.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Debug test error:', error);
      Alert.alert(
        'Debug Test Failed',
        error instanceof Error ? error.message : 'Unknown error occurred',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestSignup = async () => {
    setIsLoading(true);

    try {
      console.log('🔐 Testing signup with enhanced logging...');
      const result = await authService.signUp(email, 'TestPassword123!');
      
      Alert.alert(
        'Signup Test Complete',
        `User created: ${result.user?.id}\nEmail confirmed: ${result.user?.email_confirmed_at ? 'Yes' : 'No'}\nConfirmation sent: ${result.user?.confirmation_sent_at ? 'Yes' : 'No'}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Signup test error:', error);
      Alert.alert(
        'Signup Test Failed',
        error instanceof Error ? error.message : 'Unknown error occurred',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestResend = async () => {
    setIsLoading(true);

    try {
      console.log('📧 Testing resend confirmation...');
      await authService.resendConfirmation(email);
      
      Alert.alert(
        'Resend Test Complete',
        'Confirmation email resend attempted. Check console for details.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Resend test error:', error);
      Alert.alert(
        'Resend Test Failed',
        error instanceof Error ? error.message : 'Unknown error occurred',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckSettings = async () => {
    setIsLoading(true);

    try {
      console.log('⚙️ Checking email settings...');
      const settings = await emailDebugService.checkEmailSettings();
      
      Alert.alert(
        'Email Settings Check',
        `Configured: ${settings.configured ? 'Yes' : 'No'}\n${settings.issue || settings.message || ''}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Settings check error:', error);
      Alert.alert(
        'Settings Check Failed',
        error instanceof Error ? error.message : 'Unknown error occurred',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h2" color={theme.colors.text.primary} style={styles.title}>
            Email Debug Tools
          </Typography>
          <Typography variant="body" color={theme.colors.text.secondary} style={styles.subtitle}>
            Debug and test email confirmation functionality
          </Typography>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <InputField
            label="Test Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email to test"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Debug Actions */}
        <View style={styles.actionsContainer}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleTestEmailFlow}
            loading={isLoading}
            style={styles.actionButton}
          >
            🧪 Run Complete Email Test
          </Button>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            onPress={handleTestSignup}
            loading={isLoading}
            style={styles.actionButton}
          >
            🔐 Test Signup Only
          </Button>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            onPress={handleTestResend}
            loading={isLoading}
            style={styles.actionButton}
          >
            📧 Test Resend Confirmation
          </Button>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            onPress={handleCheckSettings}
            loading={isLoading}
            style={styles.actionButton}
          >
            ⚙️ Check Email Settings
          </Button>
        </View>

        {/* Debug Results */}
        {debugResults && (
          <View style={styles.resultsContainer}>
            <Typography variant="h3" color={theme.colors.text.primary} style={styles.resultsTitle}>
              Debug Results
            </Typography>
            
            <View style={styles.resultSection}>
              <Typography variant="body" color={theme.colors.text.secondary}>
                Email Settings: {debugResults.emailSettings?.configured ? '✅ Configured' : '❌ Not Configured'}
              </Typography>
              {debugResults.emailSettings?.issue && (
                <Typography variant="caption" color={theme.colors.error.main}>
                  Issue: {debugResults.emailSettings.issue}
                </Typography>
              )}
            </View>

            <View style={styles.resultSection}>
              <Typography variant="body" color={theme.colors.text.secondary}>
                Signup Test: {debugResults.signup?.success ? '✅ Success' : '❌ Failed'}
              </Typography>
              {debugResults.signup?.user && (
                <>
                  <Typography variant="caption" color={theme.colors.text.tertiary}>
                    User ID: {debugResults.signup.user.id}
                  </Typography>
                  <Typography variant="caption" color={theme.colors.text.tertiary}>
                    Email Confirmed: {debugResults.signup.emailConfirmed ? 'Yes' : 'No'}
                  </Typography>
                  <Typography variant="caption" color={theme.colors.text.tertiary}>
                    Confirmation Sent: {debugResults.signup.confirmationSent ? 'Yes' : 'No'}
                  </Typography>
                </>
              )}
            </View>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Typography variant="h3" color={theme.colors.text.primary} style={styles.instructionsTitle}>
            Troubleshooting Steps
          </Typography>
          
          <Typography variant="body" color={theme.colors.text.secondary} style={styles.instruction}>
            1. Check console logs for detailed error messages
          </Typography>
          <Typography variant="body" color={theme.colors.text.secondary} style={styles.instruction}>
            2. Verify Supabase project has SMTP configured
          </Typography>
          <Typography variant="body" color={theme.colors.text.secondary} style={styles.instruction}>
            3. Check email confirmation is enabled in Auth settings
          </Typography>
          <Typography variant="body" color={theme.colors.text.secondary} style={styles.instruction}>
            4. Verify email templates are configured
          </Typography>
          <Typography variant="body" color={theme.colors.text.secondary} style={styles.instruction}>
            5. Check spam folder for confirmation emails
          </Typography>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: theme.spacing.xl,
  },
  actionsContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  actionButton: {
    marginBottom: theme.spacing.sm,
  },
  resultsContainer: {
    backgroundColor: theme.colors.surface.secondary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
  },
  resultsTitle: {
    marginBottom: theme.spacing.md,
  },
  resultSection: {
    marginBottom: theme.spacing.md,
  },
  instructionsContainer: {
    backgroundColor: theme.colors.surface.secondary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  instructionsTitle: {
    marginBottom: theme.spacing.md,
  },
  instruction: {
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
});
