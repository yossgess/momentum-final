import { create } from 'zustand';
import { logEvent, Events } from '../utils/analytics';
import { profilesService } from '../services/profilesService';
import { ProfileUpdate } from '../types/database';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bio: string;
  photos: string[];
  location: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
  sports: Array<{
    name: string;
    skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    yearsPlaying: number;
  }>;
  preferences: {
    ageRange: [number, number];
    maxDistance: number;
    genderPreference: 'male' | 'female' | 'both';
    sportsInterests: string[];
  };
  coachProfile?: {
    yearsExperience: number;
    hourlyRate: number;
    certifications: string[];
    availability: Array<{
      day: string;
      startTime: string;
      endTime: string;
    }>;
    specialties: string[];
  };
}

export interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  
  setProfile: (profile: UserProfile) => void;
  loadProfile: (userId: string, email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setLoading: (loading: boolean) => void;
  addSport: (sport: UserProfile['sports'][0]) => void;
  removeSport: (sportName: string) => void;
  updateSport: (sportName: string, updates: Partial<UserProfile['sports'][0]>) => void;
  addPhoto: (photoUrl: string) => void;
  removePhoto: (photoUrl: string) => void;
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  isLoading: false,

  setProfile: (profile) => {
    set({ profile });
    logEvent(Events.PROFILE_VIEWED, { 
      userId: profile.id,
      sportsCount: profile.sports.length,
      photosCount: profile.photos.length,
    });
  },

  loadProfile: async (userId: string, email: string) => {
    const { setLoading } = get();
    
    try {
      setLoading(true);
      const profileRow = await profilesService.getProfile(userId);
      
      if (profileRow) {
        const userProfile = profilesService.convertToUserProfile(profileRow, email);
        set({ profile: userProfile });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  updateProfile: async (updates) => {
    const { profile, setLoading } = get();
    if (!profile) return;

    try {
      setLoading(true);
      
      const profileUpdates: ProfileUpdate = {};
      if (updates.firstName || updates.lastName) {
        profileUpdates.full_name = `${updates.firstName || profile.firstName} ${updates.lastName || profile.lastName}`.trim();
      }
      if (updates.photos) {
        profileUpdates.avatar_urls = updates.photos;
      }
      if (updates.preferences?.sportsInterests) {
        profileUpdates.preferred_sports = updates.preferences.sportsInterests;
      }
      
      if (Object.keys(profileUpdates).length > 0) {
        await profilesService.updateProfile(profile.id, profileUpdates);
      }
      
      const updatedProfile = { ...profile, ...updates };
      set({ profile: updatedProfile });
      
      logEvent(Events.PROFILE_EDITED, {
        userId: profile.id,
        updatedFields: Object.keys(updates).join(','),
      });
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  addSport: (sport) => {
    const { profile } = get();
    if (!profile) return;

    const updatedSports = [...profile.sports, sport];
    const updatedProfile = { ...profile, sports: updatedSports };
    
    set({ profile: updatedProfile });
    
    logEvent(Events.PROFILE_EDITED, {
      userId: profile.id,
      action: 'sport_added',
      sportName: sport.name,
      skillLevel: sport.skillLevel,
    });
  },

  removeSport: (sportName) => {
    const { profile } = get();
    if (!profile) return;

    const updatedSports = profile.sports.filter(sport => sport.name !== sportName);
    const updatedProfile = { ...profile, sports: updatedSports };
    
    set({ profile: updatedProfile });
    
    logEvent(Events.PROFILE_EDITED, {
      userId: profile.id,
      action: 'sport_removed',
      sportName,
    });
  },

  updateSport: (sportName, updates) => {
    const { profile } = get();
    if (!profile) return;

    const updatedSports = profile.sports.map(sport =>
      sport.name === sportName ? { ...sport, ...updates } : sport
    );
    const updatedProfile = { ...profile, sports: updatedSports };
    
    set({ profile: updatedProfile });
    
    logEvent(Events.PROFILE_EDITED, {
      userId: profile.id,
      action: 'sport_updated',
      sportName,
      updatedFields: Object.keys(updates).join(','),
    });
  },

  addPhoto: (photoUrl) => {
    const { profile } = get();
    if (!profile) return;

    const updatedPhotos = [...profile.photos, photoUrl];
    const updatedProfile = { ...profile, photos: updatedPhotos };
    
    set({ profile: updatedProfile });
    
    logEvent(Events.PROFILE_PHOTO_UPLOADED, {
      userId: profile.id,
      photoCount: updatedPhotos.length,
    });
  },

  removePhoto: (photoUrl) => {
    const { profile } = get();
    if (!profile) return;

    const updatedPhotos = profile.photos.filter(photo => photo !== photoUrl);
    const updatedProfile = { ...profile, photos: updatedPhotos };
    
    set({ profile: updatedProfile });
    
    logEvent(Events.PROFILE_EDITED, {
      userId: profile.id,
      action: 'photo_removed',
      photoCount: updatedPhotos.length,
    });
  },

  updatePreferences: (preferences) => {
    const { profile } = get();
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      preferences: { ...profile.preferences, ...preferences },
    };
    
    set({ profile: updatedProfile });
    
    logEvent(Events.PROFILE_EDITED, {
      userId: profile.id,
      action: 'preferences_updated',
      updatedFields: Object.keys(preferences).join(','),
    });
  },
}));
