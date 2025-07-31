import { create } from 'zustand';
import { logEvent } from '../../../shared/utils/analytics';

export interface DiscoverFilters {
  distance: number;
  ageRange: [number, number];
  gender: 'men' | 'women' | 'any';
  sports: string[];
}

interface DiscoverFiltersStore extends DiscoverFilters {
  // Actions
  setDistance: (distance: number) => void;
  setAgeRange: (ageRange: [number, number]) => void;
  setGender: (gender: 'men' | 'women' | 'any') => void;
  setSports: (sports: string[]) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  
  // State
  isApplied: boolean;
}

const defaultFilters: DiscoverFilters = {
  distance: 25,
  ageRange: [18, 35],
  gender: 'any',
  sports: [],
};

export const useDiscoverFiltersStore = create<DiscoverFiltersStore>((set, get) => ({
  // Initial state
  ...defaultFilters,
  isApplied: false,

  // Actions
  setDistance: (distance: number) => {
    set({ distance });
    logEvent('Filter_Distance_Changed', { distance });
  },

  setAgeRange: (ageRange: [number, number]) => {
    set({ ageRange });
    logEvent('Filter_AgeRange_Changed', { 
      minAge: ageRange[0], 
      maxAge: ageRange[1] 
    });
  },

  setGender: (gender: 'men' | 'women' | 'any') => {
    set({ gender });
    logEvent('Filter_Gender_Changed', { gender });
  },

  setSports: (sports: string[]) => {
    set({ sports });
    logEvent('Filter_Sports_Changed', { 
      sportsCount: sports.length,
      sports: sports.join(',') 
    });
  },

  resetFilters: () => {
    set({
      ...defaultFilters,
      isApplied: false,
    });
    logEvent('Filter_Reset');
  },

  applyFilters: () => {
    const state = get();
    set({ isApplied: true });
    
    logEvent('Filter_Applied', {
      distance: state.distance,
      minAge: state.ageRange[0],
      maxAge: state.ageRange[1],
      gender: state.gender,
      sportsCount: state.sports.length,
    });
  },
}));
