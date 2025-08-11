import { supabase } from '../../config/supabase';
import { logEvent, Events } from './analytics';

export class EmailDebugService {
  /**
   * Debug email confirmation setup and test email sending
   */
  async debugEmailConfirmation(email: string) {
    console.log('🔍 Starting email confirmation debug for:', email);
    
    try {
      // 1. Check Supabase client configuration
      console.log('📋 Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
      console.log('📋 Supabase Key (first 20 chars):', process.env.EXPO_PUBLIC_SUPABASE_KEY?.substring(0, 20) + '...');
      
      // 2. Test signup with detailed logging
      console.log('📧 Testing signup with email confirmation...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'TestPassword123!',
        options: {
          emailRedirectTo: 'momentum://onboarding-form',
          data: {
            email_confirm_redirect_url: 'momentum://onboarding-form',
            full_name: 'Test User',
          },
        },
      });

      if (error) {
        console.error('❌ Signup error:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        return { success: false, error: error.message };
      }

      console.log('✅ Signup successful:', data);
      console.log('👤 User created:', data.user?.id);
      console.log('📧 Email confirmed:', data.user?.email_confirmed_at);
      console.log('📧 Confirmation sent at:', data.user?.confirmation_sent_at);

      // 3. Check user session
      const { data: session } = await supabase.auth.getSession();
      console.log('🔐 Current session:', session.session?.user?.id);

      // 4. Test resend confirmation
      console.log('📧 Testing resend confirmation...');
      const { data: resendData, error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: 'momentum://onboarding-form',
        },
      });

      if (resendError) {
        console.error('❌ Resend error:', resendError);
      } else {
        console.log('✅ Resend successful:', resendData);
      }

      return {
        success: true,
        user: data.user,
        emailConfirmed: !!data.user?.email_confirmed_at,
        confirmationSent: !!data.user?.confirmation_sent_at,
      };

    } catch (error) {
      console.error('❌ Debug error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Check Supabase project email settings
   */
  async checkEmailSettings() {
    console.log('🔍 Checking Supabase email settings...');
    
    try {
      // Test with a simple auth operation to see if emails are configured
      const testEmail = 'test@example.com';
      const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
        redirectTo: 'momentum://onboarding-form',
      });

      if (error) {
        console.log('📧 Email settings check result:', error.message);
        
        // Common error messages that indicate email configuration issues
        if (error.message.includes('SMTP')) {
          return {
            configured: false,
            issue: 'SMTP not configured',
            solution: 'Configure SMTP settings in Supabase dashboard',
          };
        }
        
        if (error.message.includes('email')) {
          return {
            configured: false,
            issue: 'Email service not enabled',
            solution: 'Enable email authentication in Supabase dashboard',
          };
        }
      }

      return {
        configured: true,
        message: 'Email settings appear to be configured',
      };

    } catch (error) {
      console.error('❌ Email settings check error:', error);
      return {
        configured: false,
        issue: 'Unable to check email settings',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get comprehensive debug information
   */
  async getDebugInfo() {
    console.log('🔍 Gathering comprehensive debug information...');
    
    const info = {
      timestamp: new Date().toISOString(),
      environment: {
        supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.EXPO_PUBLIC_SUPABASE_KEY,
        keyLength: process.env.EXPO_PUBLIC_SUPABASE_KEY?.length || 0,
      },
      authConfig: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
      emailSettings: await this.checkEmailSettings(),
    };

    console.log('📋 Debug Info:', JSON.stringify(info, null, 2));
    return info;
  }

  /**
   * Test email confirmation flow end-to-end
   */
  async testEmailFlow(email: string) {
    console.log('🧪 Testing complete email confirmation flow...');
    
    const results = {
      signup: null as any,
      emailSettings: null as any,
      debugInfo: null as any,
    };

    try {
      // Step 1: Check email settings
      results.emailSettings = await this.checkEmailSettings();
      
      // Step 2: Get debug info
      results.debugInfo = await this.getDebugInfo();
      
      // Step 3: Test signup
      results.signup = await this.debugEmailConfirmation(email);

      console.log('🧪 Complete test results:', JSON.stringify(results, null, 2));
      return results;

    } catch (error) {
      console.error('❌ Email flow test error:', error);
      return {
        ...results,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const emailDebugService = new EmailDebugService();

// Helper function for easy debugging
export const debugEmailConfirmation = (email: string) => {
  return emailDebugService.testEmailFlow(email);
};
