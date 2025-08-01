import { create } from 'zustand';
import { PhotoData } from '../../../components/atoms/PhotoSelector/PhotoSelector.types';

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
  prefillFromSocialAuth: (name?: string, dateOfBirth?: Date) => void;
  markOnboardingAsSeen: () => void;
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

  prefillFromSocialAuth: (name, dateOfBirth) => {
    set((state) => ({
      formData: {
        ...state.formData,
        fullName: name || state.formData.fullName,
        dateOfBirth: dateOfBirth || state.formData.dateOfBirth,
      },
    }));
  },

  markOnboardingAsSeen: () => {
    set({ hasSeenOnboarding: true });
  },
}));
