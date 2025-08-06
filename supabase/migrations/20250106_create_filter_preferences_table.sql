-- Create a separate table for filter preferences as a fallback
-- This allows the feature to work without modifying the existing profiles table

CREATE TABLE IF NOT EXISTS filter_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  interested_in TEXT CHECK (interested_in IN ('men', 'women', 'any')),
  age_min INTEGER CHECK (age_min >= 18 AND age_min <= 100),
  age_max INTEGER CHECK (age_max >= 18 AND age_max <= 100),
  sports TEXT[] DEFAULT '{}',
  distance_km INTEGER CHECK (distance_km > 0 AND distance_km <= 500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure age_min <= age_max
  CONSTRAINT age_range_valid CHECK (age_min IS NULL OR age_max IS NULL OR age_min <= age_max),
  
  -- One filter preference record per user
  CONSTRAINT one_filter_per_user UNIQUE(user_id)
);

-- Add RLS policies
ALTER TABLE filter_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only access their own filter preferences
CREATE POLICY "Users can view own filter preferences" ON filter_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own filter preferences" ON filter_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own filter preferences" ON filter_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own filter preferences" ON filter_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_filter_preferences_user_id ON filter_preferences(user_id);

-- Add comments
COMMENT ON TABLE filter_preferences IS 'Stores user filter preferences for discovery feature';
COMMENT ON COLUMN filter_preferences.user_id IS 'Reference to the user profile';
COMMENT ON COLUMN filter_preferences.interested_in IS 'Gender interest preference';
COMMENT ON COLUMN filter_preferences.age_min IS 'Minimum age preference';
COMMENT ON COLUMN filter_preferences.age_max IS 'Maximum age preference';
COMMENT ON COLUMN filter_preferences.sports IS 'Array of preferred sports for filtering';
COMMENT ON COLUMN filter_preferences.distance_km IS 'Maximum distance preference in kilometers';
