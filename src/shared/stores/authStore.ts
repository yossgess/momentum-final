import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { logEvent, Events } from '../utils/analytics';

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
  completeOnboarding: () => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
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
      logEvent(Events.LOGIN_ATTEMPTED, { email });
      
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = { id: '1', email } as User;
      set({ user: mockUser, isAuthenticated: true });
      
      logEvent(Events.LOGIN_SUCCESS, { userId: mockUser.id });
    } catch (error) {
      logEvent(Events.LOGIN_FAILED, { email, error: String(error) });
      throw error;
    } finally {
      setLoading(false);
    }
  },

  signup: async (email: string, password: string, userType: 'enthusiast' | 'coach') => {
    const { setLoading } = get();
    
    try {
      setLoading(true);
      logEvent(Events.SIGNUP_ATTEMPTED, { email, userType });
      
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = { id: '1', email } as User;
      set({ user: mockUser, isAuthenticated: false, userType }); // Don't mark as authenticated until onboarding is complete
      
      logEvent(Events.SIGNUP_SUCCESS, { userId: mockUser.id, userType });
    } catch (error) {
      logEvent(Events.SIGNUP_FAILED, { email, userType, error: String(error) });
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
      
      logEvent(Events.LOGOUT, { userId: user?.id });
      set({ user: null, session: null, isAuthenticated: false, userType: null });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  refreshSession: async () => {
    try {
      console.log('Session refreshed');
    } catch (error) {
      console.error('Session refresh error:', error);
      throw error;
    }
  },
}));
