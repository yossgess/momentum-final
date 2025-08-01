export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
    };
  };
}

export interface ProfileRow {
  id: string;
  full_name: string | null;
  date_of_birth: string | null;
  gender: 'man' | 'woman' | null;
  interested_in: 'men' | 'women' | 'any' | null;
  preferred_sports: string[] | null;
  availability: {
    days: string[];
    periods: string[];
  } | null;
  avatar_urls: string[] | null;
  created_at: string;
}

export type ProfileInsert = Omit<ProfileRow, 'id' | 'created_at'> & {
  id?: string;
};
export type ProfileUpdate = Partial<ProfileInsert>;
