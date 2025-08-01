import { supabase } from '../../config/supabase';
import { logEvent, Events } from '../utils/analytics';

export class AuthService {
  async signUp(email: string, password: string) {
    try {
      console.log('Attempting signup with email:', email);
      logEvent(Events.SIGNUP_ATTEMPTED, { email });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Signup error [auth.signUp]:', error);
        logEvent(Events.SIGNUP_FAILED, { email, error: error.message });
        throw error;
      }

      console.log('Signup successful:', data);
      logEvent(Events.SIGNUP_SUCCESS, { userId: data.user?.id });
      return data;
    } catch (error) {
      console.error('Signup error details [auth.signUp]:', JSON.stringify(error, null, 2));
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
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'exp://127.0.0.1:8081/reset-password',
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
}

export const authService = new AuthService();
