import { create } from 'zustand';

interface OnboardingState {
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (seen: boolean) => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()((set) => ({
  hasSeenOnboarding: false,
  setHasSeenOnboarding: (seen: boolean) => set({ hasSeenOnboarding: seen }),
  resetOnboarding: () => set({ hasSeenOnboarding: false }),
}));
