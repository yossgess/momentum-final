import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { logEvent, Events } from '../utils/analytics';
import { authService } from '../services/authService';
import { supabase } from '../../config/supabase';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: 'enthusiast' | 'coach' | null;
  
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setUserType: (userType: 'enthusiast' | 'coach') => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userType: 'enthusiast' | 'coach') => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'facebook') => Promise<void>;
  completeOnboarding: () => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null, // No user initially - user must sign in
  session: null,
  isLoading: false,
  isAuthenticated: false, // Set to false so SignInScreen appears after onboarding
  userType: null, // No user type initially

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
    if (user) {
      logEvent(Events.LOGIN_SUCCESS, { userId: user.id });
    }
  },

  setSession: (session) => {
    set({ session, isAuthenticated: !!session });
  },

  setUserType: (userType) => {
    set({ userType });
    logEvent(Events.PROFILE_EDITED, { userType });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  login: async (email: string, password: string) => {
    const { setLoading } = get();
    
    try {
      setLoading(true);
      const { user, session } = await authService.signIn(email, password);
      set({ user, session, isAuthenticated: true });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  },

  signup: async (email: string, password: string, userType: 'enthusiast' | 'coach') => {
    const { setLoading } = get();
    
    try {
      setLoading(true);
      const { user, session } = await authService.signUp(email, password);
      set({ user, session, isAuthenticated: false, userType });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  },

  signInWithOAuth: async (provider: 'google' | 'facebook') => {
    const { setLoading } = get();
    
    try {
      setLoading(true);
      await authService.signInWithOAuth(provider);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  },

  completeOnboarding: () => {
    set({ isAuthenticated: true });
    logEvent(Events.ONBOARDING_COMPLETED);
  },

  logout: async () => {
    const { user } = get();
    
    try {
      await authService.signOut();
      logEvent(Events.LOGOUT, { userId: user?.id });
      set({ user: null, session: null, isAuthenticated: false, userType: null });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  refreshSession: async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      set({ session: data.session, user: data.user });
    } catch (error) {
      console.error('Session refresh error:', error);
      throw error;
    }
  },

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        set({ session, user: session.user, isAuthenticated: true });
      }

      supabase.auth.onAuthStateChange((event, session) => {
        set({ session, user: session?.user || null, isAuthenticated: !!session });
        
        if (event === 'SIGNED_IN') {
          logEvent(Events.LOGIN_SUCCESS, { userId: session?.user?.id });
        } else if (event === 'SIGNED_OUT') {
          logEvent(Events.LOGOUT);
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
    }
  },
}));
