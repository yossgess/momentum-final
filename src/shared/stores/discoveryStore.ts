import { create } from 'zustand';
import { ProfileRow } from '../types/database';

export interface DiscoveryState {
  // Profile queue management
  profiles: ProfileRow[];
  currentIndex: number;
  skippedProfiles: ProfileRow[];
  
  // Match modal state
  showMatchModal: boolean;
  matchedProfile: ProfileRow | null;
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setProfiles: (profiles: ProfileRow[]) => void;
  advance: () => void;
  revert: () => void;
  reset: () => void;
  
  // Match modal actions
  showMatch: (profile: ProfileRow) => void;
  hideMatch: () => void;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed getters
  getCurrentProfile: () => ProfileRow | null;
  hasProfiles: () => boolean;
  canRevert: () => boolean;
}

export const useDiscoveryStore = create<DiscoveryState>((set, get) => ({
  // Initial state
  profiles: [],
  currentIndex: 0,
  skippedProfiles: [],
  showMatchModal: false,
  matchedProfile: null,
  isLoading: false,
  error: null,

  // Profile queue actions
  setProfiles: (profiles) => {
    set({
      profiles,
      currentIndex: 0,
      skippedProfiles: [],
      error: null,
    });
  },

  advance: () => {
    const { currentIndex, profiles } = get();
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < profiles.length) {
      set({ currentIndex: nextIndex });
    } else {
      // No more profiles, could trigger refetch or show empty state
      set({ currentIndex: profiles.length });
    }
  },

  revert: () => {
    const { skippedProfiles, currentIndex, profiles } = get();
    
    if (skippedProfiles.length > 0) {
      // Get the last skipped profile
      const lastSkipped = skippedProfiles[skippedProfiles.length - 1];
      
      // Remove it from skipped profiles
      const newSkippedProfiles = skippedProfiles.slice(0, -1);
      
      // Insert it back at the current position
      const newProfiles = [...profiles];
      newProfiles.splice(currentIndex, 0, lastSkipped);
      
      set({
        profiles: newProfiles,
        skippedProfiles: newSkippedProfiles,
      });
    }
  },

  reset: () => {
    set({
      profiles: [],
      currentIndex: 0,
      skippedProfiles: [],
      showMatchModal: false,
      matchedProfile: null,
      isLoading: false,
      error: null,
    });
  },

  // Match modal actions
  showMatch: (profile) => {
    set({
      showMatchModal: true,
      matchedProfile: profile,
    });
  },

  hideMatch: () => {
    set({
      showMatchModal: false,
      matchedProfile: null,
    });
  },

  // State management
  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },

  // Computed getters
  getCurrentProfile: () => {
    const { profiles, currentIndex } = get();
    return profiles[currentIndex] || null;
  },

  hasProfiles: () => {
    const { profiles, currentIndex } = get();
    return currentIndex < profiles.length;
  },

  canRevert: () => {
    const { skippedProfiles } = get();
    return skippedProfiles.length > 0;
  },
}));
