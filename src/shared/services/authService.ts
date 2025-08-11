import { supabase } from '../../config/supabase';
import { logEvent, Events } from '../utils/analytics';

export class AuthService {
  async signUp(email: string, password: string) {
    try {
      console.log('🔐 Attempting signup with email:', email);
      logEvent(Events.SIGNUP_ATTEMPTED, { email });
      
      // Enhanced signup with comprehensive email confirmation options
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Primary redirect URL for email confirmation
          emailRedirectTo: 'momentum://onboarding-form',
          // Additional data for email templates
          data: {
            email_confirm_redirect_url: 'momentum://onboarding-form',
            app_name: 'Momentum',
            confirmation_url: 'momentum://onboarding-form',
          },
        },
      });

      if (error) {
        console.error('❌ Signup error [auth.signUp]:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        logEvent(Events.SIGNUP_FAILED, { email, error: error.message });
        
        // Enhanced error handling for email-specific issues
        if (error.message.includes('SMTP') || error.message.includes('email')) {
          console.error('📧 Email configuration issue detected');
          throw new Error('Email service is not properly configured. Please contact support.');
        }
        
        throw error;
      }

      console.log('✅ Signup successful:', data);
      console.log('👤 User ID:', data.user?.id);
      console.log('📧 Email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No');
      console.log('📧 Confirmation sent:', data.user?.confirmation_sent_at ? 'Yes' : 'No');
      
      // Log detailed success analytics
      logEvent(Events.SIGNUP_SUCCESS, { 
        userId: data.user?.id,
        emailConfirmed: !!data.user?.email_confirmed_at,
        confirmationSent: !!data.user?.confirmation_sent_at,
      });
      
      return data;
    } catch (error) {
      console.error('❌ Signup error details [auth.signUp]:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      console.log('Attempting signin with email:', email);
      logEvent(Events.LOGIN_ATTEMPTED, { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Signin error [auth.signInWithPassword]:', error);
        logEvent(Events.LOGIN_FAILED, { email, error: error.message });
        throw error;
      }

      console.log('Signin successful:', data);
      logEvent(Events.LOGIN_SUCCESS, { userId: data.user?.id });
      return data;
    } catch (error) {
      console.error('Signin error details [auth.signInWithPassword]:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  async signOut() {
    try {
      console.log('Attempting signout...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Signout error [auth.signOut]:', error);
        throw error;
      }
      
      console.log('Signout successful');
      logEvent(Events.LOGOUT);
    } catch (error) {
      console.error('Signout error details [auth.signOut]:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  async signInWithOAuth(provider: 'google' | 'facebook') {
    try {
      console.log('Attempting OAuth signin with provider:', provider);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: 'exp://127.0.0.1:8081',
        },
      });

      if (error) {
        console.error('OAuth signin error [auth.signInWithOAuth]:', error);
        throw error;
      }
      
      console.log('OAuth signin successful:', data);
      return data;
    } catch (error) {
      console.error('OAuth signin error details [auth.signInWithOAuth]:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  async resetPassword(email: string) {
    try {
      console.log('Attempting password reset for email:', email);
      logEvent(Events.PASSWORD_RESET_REQUESTED, { email });
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'momentum://onboarding-form',
      });

      if (error) {
        console.error('Password reset error [auth.resetPasswordForEmail]:', error);
        throw error;
      }
      
      console.log('Password reset successful:', data);
      return data;
    } catch (error) {
      console.error('Password reset error details [auth.resetPasswordForEmail]:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  async resendConfirmation(email: string) {
    try {
      console.log('📧 Attempting to resend confirmation for email:', email);
      logEvent(Events.EMAIL_CONFIRMATION_RESENT, { email });
      
      // Check current user status first
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 Current user status:', {
        id: user?.id,
        email: user?.email,
        emailConfirmed: user?.email_confirmed_at,
        confirmationSent: user?.confirmation_sent_at,
      });
      
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: 'momentum://onboarding-form',
        },
      });

      if (error) {
        console.error('❌ Resend confirmation error [auth.resend]:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        
        // Enhanced error handling for common issues
        if (error.message.includes('already confirmed')) {
          console.log('✅ Email already confirmed');
          throw new Error('Email is already confirmed. You can proceed to sign in.');
        }
        
        if (error.message.includes('SMTP') || error.message.includes('email')) {
          console.error('📧 Email service configuration issue');
          throw new Error('Email service is not available. Please try again later or contact support.');
        }
        
        if (error.message.includes('rate limit')) {
          console.error('⏰ Rate limit exceeded');
          throw new Error('Too many email requests. Please wait a few minutes before trying again.');
        }
        
        throw error;
      }
      
      console.log('✅ Resend confirmation successful:', data);
      console.log('📧 Confirmation email sent to:', email);
      
      return data;
    } catch (error) {
      console.error('❌ Resend confirmation error details [auth.resend]:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  async updateEmail(newEmail: string) {
    try {
      console.log('Attempting to update email to:', newEmail);
      logEvent(Events.EMAIL_UPDATED, { newEmail });
      
      const { data, error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) {
        console.error('Update email error [auth.updateUser]:', error);
        throw error;
      }
      
      console.log('Update email successful:', data);
      return data;
    } catch (error) {
      console.error('Update email error details [auth.updateUser]:', JSON.stringify(error, null, 2));
      throw error;
    }
  }
}

export const authService = new AuthService();
