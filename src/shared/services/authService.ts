import { supabase } from '../../config/supabase';
import { logEvent, Events } from '../utils/analytics';

export class AuthService {
  async signUp(email: string, password: string) {
    logEvent(Events.SIGNUP_ATTEMPTED, { email });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      logEvent(Events.SIGNUP_FAILED, { email, error: error.message });
      throw error;
    }

    logEvent(Events.SIGNUP_SUCCESS, { userId: data.user?.id });
    return data;
  }

  async signIn(email: string, password: string) {
    logEvent(Events.LOGIN_ATTEMPTED, { email });
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logEvent(Events.LOGIN_FAILED, { email, error: error.message });
      throw error;
    }

    logEvent(Events.LOGIN_SUCCESS, { userId: data.user?.id });
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    logEvent(Events.LOGOUT);
  }

  async signInWithOAuth(provider: 'google' | 'facebook') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: 'exp://127.0.0.1:8081',
      },
    });

    if (error) throw error;
    return data;
  }

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'exp://127.0.0.1:8081/reset-password',
    });

    if (error) throw error;
    return data;
  }
}

export const authService = new AuthService();
