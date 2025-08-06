-- Add filter preference columns to profiles table
-- These columns will store user's saved filter preferences for discovery

ALTER TABLE profiles 
ADD COLUMN filter_interested_in TEXT CHECK (filter_interested_in IN ('men', 'women', 'any')),
ADD COLUMN filter_age_min INTEGER CHECK (filter_age_min >= 18 AND filter_age_min <= 100),
ADD COLUMN filter_age_max INTEGER CHECK (filter_age_max >= 18 AND filter_age_max <= 100),
ADD COLUMN filter_sports TEXT[] DEFAULT '{}',
ADD COLUMN filter_distance_km INTEGER CHECK (filter_distance_km > 0 AND filter_distance_km <= 500);

-- Add constraint to ensure age_min <= age_max
ALTER TABLE profiles 
ADD CONSTRAINT filter_age_range_valid 
CHECK (filter_age_min IS NULL OR filter_age_max IS NULL OR filter_age_min <= filter_age_max);

-- Add comments for documentation
COMMENT ON COLUMN profiles.filter_interested_in IS 'User''s saved preference for gender interest in discovery';
COMMENT ON COLUMN profiles.filter_age_min IS 'User''s saved minimum age preference for discovery';
COMMENT ON COLUMN profiles.filter_age_max IS 'User''s saved maximum age preference for discovery';
COMMENT ON COLUMN profiles.filter_sports IS 'User''s saved sports preferences for discovery filtering';
COMMENT ON COLUMN profiles.filter_distance_km IS 'User''s saved maximum distance preference in kilometers';
