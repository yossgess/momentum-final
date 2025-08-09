import { supabase } from '../../config/supabase';
import { ProfileUpdate } from '../types/database';

export interface FilterPreferences {
  interestedIn: 'men' | 'women' | 'any';
  ageRange: [number, number];
  sports: string[];
  distanceKm: number;
}

export class FilterPreferencesService {
  /**
   * Save user's filter preferences to the database using separate table
   */
  async saveFilterPreferences(userId: string, preferences: FilterPreferences): Promise<void> {
    const filterData = {
      user_id: userId,
      interested_in: preferences.interestedIn,
      age_min: preferences.ageRange[0],
      age_max: preferences.ageRange[1],
      sports: preferences.sports,
      distance_km: preferences.distanceKm,
      updated_at: new Date().toISOString(),
    };

    // Use upsert to insert or update existing preferences
    const { error } = await supabase
      .from('filter_preferences')
      .upsert(filterData, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Failed to save filter preferences:', error);
      throw error;
    }

    // console.log('Filter preferences saved successfully for user:', userId);
  }

  /**
   * Load user's filter preferences from the database using separate table
   */
  async loadFilterPreferences(userId: string): Promise<FilterPreferences | null> {
    const { data, error } = await supabase
      .from('filter_preferences')
      .select('interested_in, age_min, age_max, sports, distance_km')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No preferences found - this is normal for new users
        // console.log('No filter preferences found for user:', userId);
        return null;
      }
      console.error('Failed to load filter preferences:', error);
      return null;
    }

    if (!data) {
      console.log('No filter preferences found for user:', userId);
      return null;
    }

    // Return preferences with defaults for missing values
    return {
      interestedIn: data.interested_in || 'any',
      ageRange: [
        data.age_min || 18,
        data.age_max || 35
      ],
      sports: data.sports || [],
      distanceKm: data.distance_km || 25,
    };
  }

  /**
   * Set default filter preferences from onboarding data
   */
  async setDefaultFilterPreferences(
    userId: string, 
    interestedIn: 'men' | 'women' | 'any',
    preferredSports: string[]
  ): Promise<void> {
    const defaultPreferences: FilterPreferences = {
      interestedIn,
      ageRange: [18, 35], // Default age range
      sports: preferredSports,
      distanceKm: 25, // Default distance
    };

    await this.saveFilterPreferences(userId, defaultPreferences);
    // console.log('Default filter preferences set from onboarding for user:', userId);
  }
}

export const filterPreferencesService = new FilterPreferencesService();
