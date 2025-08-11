import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../config/supabase';
import { authService } from '../services/authService';
import { logEvent, Events } from '../utils/analytics';

// AsyncStorage keys for profile completion per user
const PROFILE_COMPLETED_PREFIX = '@momentum/profile_completed_';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedProfile: boolean;
  userType: 'enthusiast' | 'coach' | null;
  
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setUserType: (userType: 'enthusiast' | 'coach') => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userType: 'enthusiast' | 'coach') => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'facebook') => Promise<void>;
  completeOnboarding: () => Promise<void>;
  checkProfileCompletion: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null, // No user initially - user must sign in
  session: null,
  isLoading: false,
  isAuthenticated: false, // Set to false so SignInScreen appears after onboarding
  hasCompletedProfile: false, // Set to false so OnboardingForm appears after auth
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
    const { setLoading, checkProfileCompletion } = get();
    
    try {
      setLoading(true);
      const { user, session } = await authService.signIn(email, password);
      set({ user, session, isAuthenticated: true });
      
      // Check if user has completed profile
      if (user) {
        await checkProfileCompletion(user.id);
      }
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

  completeOnboarding: async () => {
    const { user } = get();
    if (user) {
      try {
        await AsyncStorage.setItem(`${PROFILE_COMPLETED_PREFIX}${user.id}`, 'true');
        set({ hasCompletedProfile: true });
        logEvent(Events.ONBOARDING_COMPLETED);
      } catch (error) {
        console.error('Failed to save profile completion status:', error);
      }
    }
  },

  checkProfileCompletion: async (userId: string) => {
    try {
      // Check if profile exists in database (more reliable than AsyncStorage)
      const { profilesService } = await import('../services/profilesService');
      const profile = await profilesService.getProfile(userId);
      const hasCompletedProfile = !!profile;
      
      set({ hasCompletedProfile });
      
      // Also update AsyncStorage to keep it in sync
      if (hasCompletedProfile) {
        await AsyncStorage.setItem(`${PROFILE_COMPLETED_PREFIX}${userId}`, 'true');
      }
    } catch (error) {
      console.error('Failed to check profile completion status:', error);
      // Fallback to AsyncStorage if database check fails
      try {
        const hasCompleted = await AsyncStorage.getItem(`${PROFILE_COMPLETED_PREFIX}${userId}`);
        set({ hasCompletedProfile: hasCompleted === 'true' });
      } catch (storageError) {
        console.error('Failed to check AsyncStorage fallback:', storageError);
        set({ hasCompletedProfile: false });
      }
    }
  },

  logout: async () => {
    const { user } = get();
    
    try {
      await authService.signOut();
      logEvent(Events.LOGOUT, { userId: user?.id });
      set({ user: null, session: null, isAuthenticated: false, hasCompletedProfile: false, userType: null });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  refreshSession: async () => {
    try {
      console.log('Attempting to refresh session...');
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      console.log('Session refresh successful:', data);
      set({ session: data.session, user: data.user });
    } catch (error) {
      console.error('Session refresh error [auth.refreshSession]:', error);
      console.error('Session refresh error details:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  initialize: async () => {
    console.log('[AUTH] Initializing auth store...');

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      console.log('[AUTH] Got session from getSession:', !!session);
      if (session) {
        console.log('[AUTH] Setting authenticated user:', session.user.id);
        set({ session, user: session.user, isAuthenticated: true });
        
        // CRITICAL: Wait for profile completion check to finish
        console.log('[AUTH] Checking profile completion for user:', session.user.id);
        await get().checkProfileCompletion(session.user.id);
        console.log('[AUTH] Profile completion check finished');
      } else {
        console.log('[AUTH] No session found, user not authenticated');
        set({ session: null, user: null, isAuthenticated: false, hasCompletedProfile: false });
      }
    } catch (err) {
      console.error('[AUTH] Error while getting session:', err);
      console.error('[AUTH] Session error details:', JSON.stringify(err, null, 2));
      // Set safe defaults on error
      set({ session: null, user: null, isAuthenticated: false, hasCompletedProfile: false });
    }

    // Attach listener after initial session
    console.log('[AUTH] Setting up auth state change listener...');
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AUTH] Auth state change:', event, !!session);
        set({ session, user: session?.user || null, isAuthenticated: !!session });
        
        if (event === 'SIGNED_IN' && session?.user) {
          logEvent(Events.LOGIN_SUCCESS, { userId: session.user.id });
          // Check profile completion for newly signed in users
          await get().checkProfileCompletion(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          logEvent(Events.LOGOUT);
          set({ hasCompletedProfile: false });
        }
      }
    );

    // Store cleanup function for later use if needed
    // For now, we don't return it to match the interface
    console.log('[AUTH] Auth initialization complete');
  },
}));
