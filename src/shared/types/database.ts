export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      filter_preferences: {
        Row: FilterPreferencesRow;
        Insert: FilterPreferencesInsert;
        Update: FilterPreferencesUpdate;
      };
    };
  };
}

export interface ProfileRow {
  id: string;
  full_name: string | null;
  date_of_birth: string | null;
  gender: 'man' | 'woman' | null;
  // interested_in moved to filter_preferences table
  // preferred_sports moved to filter_preferences table as 'sports'
  availability: {
    days: string[];
    periods: string[];
  } | null;
  avatar_urls: string[] | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
}

export type ProfileInsert = Omit<ProfileRow, 'id' | 'created_at'> & {
  id?: string;
};
export type ProfileUpdate = Partial<ProfileInsert>;

export interface FilterPreferencesRow {
  id: string;
  user_id: string;
  interested_in: 'men' | 'women' | 'any' | null;
  age_min: number | null;
  age_max: number | null;
  sports: string[] | null;
  distance_km: number | null;
  created_at: string;
  updated_at: string;
}

export type FilterPreferencesInsert = Omit<FilterPreferencesRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};
export type FilterPreferencesUpdate = Partial<FilterPreferencesInsert>;
