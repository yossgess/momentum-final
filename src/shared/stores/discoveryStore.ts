import { create } from 'zustand';
import { ProfileRow } from '../types/database';

export interface DiscoveryState {
  // Profile queue management
  profilesQueue: ProfileRow[];
  currentIndex: number;
  skippedProfiles: ProfileRow[];
  totalFetched: number; // Track total profiles fetched for offset calculation
  isLoadingBatch: boolean; // Loading state for batch fetching
  
  // Match modal state
  showMatchModal: boolean;
  matchedProfile: ProfileRow | null;
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setProfiles: (profiles: ProfileRow[]) => void;
  addProfiles: (profiles: ProfileRow[]) => void; // Add new batch to queue
  advance: () => void;
  revert: () => void;
  reset: () => void;
  
  // Match modal actions
  showMatch: (profile: ProfileRow) => void;
  hideMatch: () => void;
  
  // State management
  setLoading: (loading: boolean) => void;
  setLoadingBatch: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed getters
  getCurrentProfile: () => ProfileRow | null;
  hasProfiles: () => boolean;
  canRevert: () => boolean;
  needsMoreProfiles: () => boolean; // Check if we need to fetch more profiles
  getRemainingProfilesCount: () => number;
}

export const useDiscoveryStore = create<DiscoveryState>((set, get) => ({
  // Initial state
  profilesQueue: [],
  currentIndex: 0,
  skippedProfiles: [],
  totalFetched: 0,
  isLoadingBatch: false,
  showMatchModal: false,
  matchedProfile: null,
  isLoading: false,
  error: null,

  // Profile queue actions
  setProfiles: (profiles) => {
    set({
      profilesQueue: profiles,
      currentIndex: 0,
      skippedProfiles: [],
      totalFetched: profiles.length,
      error: null,
    });
  },

  addProfiles: (profiles) => {
    const { profilesQueue, totalFetched } = get();
    set({
      profilesQueue: [...profilesQueue, ...profiles],
      totalFetched: totalFetched + profiles.length,
      isLoadingBatch: false,
    });
  },

  advance: () => {
    const { currentIndex, profilesQueue } = get();
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < profilesQueue.length) {
      set({ currentIndex: nextIndex });
    } else {
      // No more profiles, set index to queue length
      set({ currentIndex: profilesQueue.length });
    }
  },

  revert: () => {
    const { skippedProfiles, currentIndex, profilesQueue } = get();
    
    if (skippedProfiles.length > 0) {
      // Get the last skipped profile
      const lastSkipped = skippedProfiles[skippedProfiles.length - 1];
      
      // Remove it from skipped profiles
      const newSkippedProfiles = skippedProfiles.slice(0, -1);
      
      // Insert it back at the current position
      const newProfilesQueue = [...profilesQueue];
      newProfilesQueue.splice(currentIndex, 0, lastSkipped);
      
      set({
        profilesQueue: newProfilesQueue,
        skippedProfiles: newSkippedProfiles,
      });
    }
  },

  reset: () => {
    set({
      profilesQueue: [],
      currentIndex: 0,
      skippedProfiles: [],
      totalFetched: 0,
      isLoadingBatch: false,
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

  setLoadingBatch: (loading) => {
    set({ isLoadingBatch: loading });
  },

  setError: (error) => {
    set({ error });
  },

  // Computed getters
  getCurrentProfile: () => {
    const { profilesQueue, currentIndex } = get();
    return profilesQueue[currentIndex] || null;
  },

  hasProfiles: () => {
    const { profilesQueue, currentIndex } = get();
    return currentIndex < profilesQueue.length;
  },

  canRevert: () => {
    const { skippedProfiles } = get();
    return skippedProfiles.length > 0;
  },

  needsMoreProfiles: () => {
    const { profilesQueue, currentIndex } = get();
    const remainingProfiles = profilesQueue.length - currentIndex;
    return remainingProfiles <= 3; // Trigger fetch when 3 or fewer profiles left
  },

  getRemainingProfilesCount: () => {
    const { profilesQueue, currentIndex } = get();
    return Math.max(0, profilesQueue.length - currentIndex);
  },
}));
