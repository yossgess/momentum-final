import { supabase } from '../../config/supabase';
import { ProfileInsert, ProfileUpdate, ProfileRow } from '../types/database';
import { OnboardingFormData } from '../../features/onboarding/store/onboardingStore';
import { UserProfile } from '../stores/userStore';

export class ProfilesService {
  async createProfile(userId: string, onboardingData: OnboardingFormData): Promise<ProfileRow> {
    const profileData: ProfileInsert = {
      id: userId,
      full_name: onboardingData.fullName,
      date_of_birth: onboardingData.dateOfBirth?.toISOString().split('T')[0] || null,
      gender: onboardingData.gender,
      // interested_in is now stored in filter_preferences table
      // preferred_sports is now stored in filter_preferences table as 'sports'
      availability: onboardingData.availability,
      avatar_urls: onboardingData.photos.map(photo => photo.uri),
      lat: null, // Location will be set later via locationService
      lng: null, // Location will be set later via locationService
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getProfile(userId: string): Promise<ProfileRow | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateProfile(userId: string, updates: ProfileUpdate): Promise<ProfileRow> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  convertToUserProfile(profileRow: ProfileRow, email: string): UserProfile {
    const [firstName, ...lastNameParts] = (profileRow.full_name || '').split(' ');
    const lastName = lastNameParts.join(' ');
    
    return {
      id: profileRow.id,
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      age: profileRow.date_of_birth ? 
        new Date().getFullYear() - new Date(profileRow.date_of_birth).getFullYear() : 0,
      gender: profileRow.gender === 'man' ? 'male' : 
              profileRow.gender === 'woman' ? 'female' : 'other',
      bio: '',
      photos: profileRow.avatar_urls || [],
      location: { latitude: 0, longitude: 0, city: '', country: '' },
      sports: [], // Sports now come from filter_preferences table
      preferences: {
        ageRange: [18, 65],
        maxDistance: 50,
        // genderPreference now comes from filter_preferences table, defaulting to 'both'
        genderPreference: 'both' as const,
        sportsInterests: [], // Sports interests now come from filter_preferences table
      },
    };
  }

  convertFromUserProfile(userProfile: UserProfile): ProfileUpdate {
    return {
      full_name: `${userProfile.firstName} ${userProfile.lastName}`.trim(),
      avatar_urls: userProfile.photos,
      // preferred_sports is now stored in filter_preferences table as 'sports'
    };
  }
}

export const profilesService = new ProfilesService();
