import { create } from 'zustand';
import { logEvent } from '../../../shared/utils/analytics';
import { filterPreferencesService, FilterPreferences } from '../../../shared/services/filterPreferencesService';
import { useAuthStore } from '../../../shared/stores/authStore';

// Aligned with RPC function parameters for proper filtering
export interface DiscoverFilters {
  interestedIn: 'men' | 'women' | 'any'; // What user is interested in (maps to interested_in_filter)
  ageRange: [number, number]; // Age range [min, max] (maps to min_age, max_age)
  sports: string[]; // Preferred sports (maps to sports_filter)
  distanceKm: number; // Maximum distance in km (maps to max_distance_km)
}

interface DiscoverFiltersStore extends DiscoverFilters {
  isApplied: boolean;
  setInterestedIn: (interestedIn: 'men' | 'women' | 'any') => Promise<void>;
  setAgeRange: (range: [number, number]) => Promise<void>;
  setSports: (sports: string[]) => Promise<void>;
  setDistance: (distance: number) => Promise<void>;
  resetFilters: () => void;
  applyFilters: () => Promise<void>;
  // Database persistence methods
  loadFilterPreferences: () => Promise<void>;
  saveFilterPreferences: () => Promise<void>;
}

const defaultFilters: DiscoverFilters = {
  interestedIn: 'any', // Default to any gender preference
  ageRange: [18, 35], // Default age range
  sports: [], // No sports filter by default
  distanceKm: 25, // Default 25km radius
};

export const useDiscoverFiltersStore = create<DiscoverFiltersStore>((set, get) => ({
  // Initial state
  ...defaultFilters,
  isApplied: false,

  // Actions - Now save to database immediately on change
  setDistance: async (distanceKm: number) => {
    set({ distanceKm });
    await get().saveFilterPreferences();
    logEvent('Filter_Distance_Changed', { distanceKm });
  },

  setAgeRange: async (ageRange: [number, number]) => {
    set({ ageRange });
    await get().saveFilterPreferences();
    logEvent('Filter_AgeRange_Changed', { 
      minAge: ageRange[0], 
      maxAge: ageRange[1] 
    });
  },

  setInterestedIn: async (interestedIn: 'men' | 'women' | 'any') => {
    set({ interestedIn });
    await get().saveFilterPreferences();
    logEvent('Filter_InterestedIn_Changed', { interestedIn });
  },

  setSports: async (sports: string[]) => {
    set({ sports });
    await get().saveFilterPreferences();
    logEvent('Filter_Sports_Changed', { 
      sportsCount: sports.length,
      sports: sports.join(',') 
    });
  },

  resetFilters: () => {
    set({ ...defaultFilters, isApplied: false });
    logEvent('Filter_Reset', { 
      interestedIn: get().interestedIn,
      minAge: get().ageRange[0],
      maxAge: get().ageRange[1],
      sportsCount: get().sports.length,
      distance: get().distanceKm
    });
  },

  applyFilters: async () => {
    const state = get();
    set({ isApplied: true });
    
    // Save preferences to database when filters are applied
    await get().saveFilterPreferences();
    
    logEvent('Filter_Applied', {
      distanceKm: state.distanceKm,
      minAge: state.ageRange[0],
      maxAge: state.ageRange[1],
      interestedIn: state.interestedIn,
      sportsCount: state.sports.length,
    });
  },

  // Database persistence methods
  loadFilterPreferences: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      // console.log('No authenticated user, skipping filter preferences load');
      return;
    }

    try {
      const preferences = await filterPreferencesService.loadFilterPreferences(user.id);
      if (preferences) {
        set({
          interestedIn: preferences.interestedIn,
          ageRange: preferences.ageRange,
          sports: preferences.sports,
          distanceKm: preferences.distanceKm,
        });
        
        logEvent('Filter_Preferences_Loaded', {
          interestedIn: preferences.interestedIn,
          minAge: preferences.ageRange[0],
          maxAge: preferences.ageRange[1],
          sportsCount: preferences.sports.length,
          distanceKm: preferences.distanceKm,
        });
        
        // console.log('Filter preferences loaded from database');
      }
    } catch (error) {
      console.error('Failed to load filter preferences:', error);
    }
  },

  saveFilterPreferences: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      // console.log('No authenticated user, skipping filter preferences save');
      return;
    }

    const state = get();
    const preferences: FilterPreferences = {
      interestedIn: state.interestedIn,
      ageRange: state.ageRange,
      sports: state.sports,
      distanceKm: state.distanceKm,
    };

    try {
      await filterPreferencesService.saveFilterPreferences(user.id, preferences);
      
      logEvent('Filter_Preferences_Saved', {
        interestedIn: preferences.interestedIn,
        minAge: preferences.ageRange[0],
        maxAge: preferences.ageRange[1],
        sportsCount: preferences.sports.length,
        distanceKm: preferences.distanceKm,
      });
      
      // console.log('Filter preferences saved to database');
    } catch (error) {
      console.error('Failed to save filter preferences:', error);
    }
  },
}));
