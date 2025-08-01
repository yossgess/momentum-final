import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PhotoData } from '../../../components/atoms/PhotoSelector/PhotoSelector.types';

// AsyncStorage keys
const ONBOARDING_SEEN_KEY = '@momentum/hasSeenOnboarding';
const PROFILE_COMPLETED_KEY = '@momentum/hasCompletedProfile';

export interface OnboardingFormData {
  fullName: string;
  dateOfBirth: Date | null;
  gender: 'man' | 'woman' | null;
  interestedIn: 'men' | 'women' | 'any' | null;
  preferredSports: string[];
  availability: {
    days: string[];
    periods: string[];
  };
  photos: PhotoData[];
  mainPhotoIndex: number;
}

export interface OnboardingState {
  formData: OnboardingFormData;
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  error: string | null;
  hasSeenOnboarding: boolean;
  
  // Actions
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetForm: () => void;
  resetOnboardingState: () => void;
  prefillFromSocialAuth: (name?: string, dateOfBirth?: Date) => void;
  markOnboardingAsSeen: () => Promise<void>;
  loadPersistedState: () => Promise<void>;
}

const initialFormData: OnboardingFormData = {
  fullName: '',
  dateOfBirth: null,
  gender: null,
  interestedIn: null,
  preferredSports: [],
  availability: {
    days: [],
    periods: [],
  },
  photos: [],
  mainPhotoIndex: 0,
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  formData: initialFormData,
  currentStep: 0,
  totalSteps: 3,
  isLoading: false,
  error: null,
  hasSeenOnboarding: false,

  updateFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
  },

  setCurrentStep: (step) => {
    set({ currentStep: step });
  },

  nextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },

  resetForm: () => {
    set({
      formData: initialFormData,
      currentStep: 0,
      isLoading: false,
      error: null,
    });
  },

  resetOnboardingState: () => {
    set({
      formData: initialFormData,
      currentStep: 0,
      isLoading: false,
      error: null,
      hasSeenOnboarding: false, // Reset this flag for development mode
    });
  },

  prefillFromSocialAuth: (name, dateOfBirth) => {
    set((state) => ({
      formData: {
        ...state.formData,
        fullName: name || state.formData.fullName,
        dateOfBirth: dateOfBirth || state.formData.dateOfBirth,
      },
    }));
  },

  markOnboardingAsSeen: async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
      set({ hasSeenOnboarding: true });
    } catch (error) {
      console.error('Failed to save onboarding seen status:', error);
    }
  },

  // Load persisted onboarding state
  loadPersistedState: async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_SEEN_KEY);
      if (hasSeenOnboarding === 'true') {
        set({ hasSeenOnboarding: true });
      }
    } catch (error) {
      console.error('Failed to load onboarding state:', error);
    }
  },
}));
