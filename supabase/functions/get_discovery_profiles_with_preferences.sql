-- Updated RPC function that can use saved filter preferences from filter_preferences table
-- This function can work with both explicit parameters and saved user preferences

CREATE OR REPLACE FUNCTION get_discovery_profiles_with_preferences(
  user_id UUID,
  use_saved_preferences BOOLEAN DEFAULT FALSE,
  gender_filter TEXT DEFAULT NULL,
  interested_in_filter TEXT DEFAULT NULL,
  min_age INTEGER DEFAULT NULL,
  max_age INTEGER DEFAULT NULL,
  sports_filter TEXT[] DEFAULT NULL,
  max_distance_km INTEGER DEFAULT 90
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  date_of_birth DATE,
  gender TEXT,
  interested_in TEXT,
  preferred_sports TEXT[],
  availability JSONB,
  avatar_urls TEXT[],
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMP,
  distance_km DOUBLE PRECISION
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_lat DOUBLE PRECISION;
  current_user_lng DOUBLE PRECISION;
  current_user_gender TEXT;
  current_user_interested_in TEXT;
  
  -- Variables for filter preferences
  final_interested_in_filter TEXT;
  final_min_age INTEGER;
  final_max_age INTEGER;
  final_sports_filter TEXT[];
  final_max_distance_km INTEGER;
BEGIN
  -- Get current user's profile data for filtering
  SELECT p.lat, p.lng, p.gender, p.interested_in
  INTO current_user_lat, current_user_lng, current_user_gender, current_user_interested_in
  FROM profiles p
  WHERE p.id = user_id;

  -- If user not found, return empty result
  IF current_user_gender IS NULL THEN
    RETURN;
  END IF;

  -- Determine which filters to use
  IF use_saved_preferences THEN
    -- Try to load saved preferences from filter_preferences table
    SELECT 
      COALESCE(fp.interested_in, interested_in_filter, 'any'),
      COALESCE(fp.age_min, min_age, 18),
      COALESCE(fp.age_max, max_age, 35),
      COALESCE(fp.sports, sports_filter, ARRAY[]::TEXT[]),
      COALESCE(fp.distance_km, max_distance_km, 90)
    INTO 
      final_interested_in_filter,
      final_min_age,
      final_max_age,
      final_sports_filter,
      final_max_distance_km
    FROM filter_preferences fp
    WHERE fp.user_id = get_discovery_profiles_with_preferences.user_id;
    
    -- If no saved preferences found, use provided parameters or defaults
    IF NOT FOUND THEN
      final_interested_in_filter := COALESCE(interested_in_filter, 'any');
      final_min_age := COALESCE(min_age, 18);
      final_max_age := COALESCE(max_age, 35);
      final_sports_filter := COALESCE(sports_filter, ARRAY[]::TEXT[]);
      final_max_distance_km := COALESCE(max_distance_km, 90);
    END IF;
  ELSE
    -- Use provided parameters directly
    final_interested_in_filter := COALESCE(interested_in_filter, 'any');
    final_min_age := COALESCE(min_age, 18);
    final_max_age := COALESCE(max_age, 35);
    final_sports_filter := COALESCE(sports_filter, ARRAY[]::TEXT[]);
    final_max_distance_km := COALESCE(max_distance_km, 90);
  END IF;

  -- Return filtered profiles with distance calculation
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.date_of_birth,
    p.gender,
    p.interested_in,
    p.preferred_sports,
    p.availability,
    p.avatar_urls,
    p.lat,
    p.lng,
    p.created_at,
    -- Calculate distance using Haversine formula
    CASE 
      WHEN current_user_lat IS NOT NULL AND current_user_lng IS NOT NULL 
           AND p.lat IS NOT NULL AND p.lng IS NOT NULL THEN
        6371 * acos(
          cos(radians(current_user_lat)) * 
          cos(radians(p.lat)) * 
          cos(radians(p.lng) - radians(current_user_lng)) + 
          sin(radians(current_user_lat)) * 
          sin(radians(p.lat))
        )
      ELSE NULL
    END AS distance_km
  FROM profiles p
  WHERE 
    -- Exclude self
    p.id != get_discovery_profiles_with_preferences.user_id
    
    -- MUTUAL INTEREST COMPATIBILITY LOGIC
    -- This ensures both users are compatible with each other's preferences
    AND (
      -- Case 1: No specific interest filter (show all mutual matches)
      final_interested_in_filter IS NULL OR final_interested_in_filter = 'any' OR
      
      -- Case 2: Specific interest filter - check mutual compatibility
      (
        -- Part A: User is interested in the profile's gender
        (
          (final_interested_in_filter = 'men' AND p.gender = 'man') OR
          (final_interested_in_filter = 'women' AND p.gender = 'woman')
        )
        AND
        -- Part B: Profile is interested in the user's gender (or anyone)
        (
          p.interested_in = 'any' OR
          (p.interested_in = 'men' AND current_user_gender = 'man') OR
          (p.interested_in = 'women' AND current_user_gender = 'woman')
        )
      )
    )
    
    -- Age filter based on date of birth
    AND (
      (final_min_age IS NULL OR EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth)) >= final_min_age) AND
      (final_max_age IS NULL OR EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth)) <= final_max_age)
    )
    
    -- Sports compatibility filter (array overlap)
    AND (
      final_sports_filter IS NULL OR
      array_length(final_sports_filter, 1) IS NULL OR
      array_length(final_sports_filter, 1) = 0 OR
      p.preferred_sports && final_sports_filter
    )
    
    -- Distance filter using Haversine formula
    AND (
      final_max_distance_km IS NULL OR
      current_user_lat IS NULL OR current_user_lng IS NULL OR
      p.lat IS NULL OR p.lng IS NULL OR
      6371 * acos(
        cos(radians(current_user_lat)) * 
        cos(radians(p.lat)) * 
        cos(radians(p.lng) - radians(current_user_lng)) + 
        sin(radians(current_user_lat)) * 
        sin(radians(p.lat))
      ) <= final_max_distance_km
    )
    
  ORDER BY 
    -- Prioritize profiles with location data and closer distance
    CASE WHEN p.lat IS NOT NULL AND p.lng IS NOT NULL THEN 0 ELSE 1 END,
    distance_km ASC NULLS LAST,
    p.created_at DESC
  LIMIT 50;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in get_discovery_profiles_with_preferences: %', SQLERRM;
    RETURN;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_discovery_profiles_with_preferences TO authenticated;

-- Create a simpler wrapper function that maintains backward compatibility
CREATE OR REPLACE FUNCTION get_discovery_profiles(
  user_id UUID,
  gender_filter TEXT DEFAULT NULL,
  interested_in_filter TEXT DEFAULT NULL,
  min_age INTEGER DEFAULT NULL,
  max_age INTEGER DEFAULT NULL,
  sports_filter TEXT[] DEFAULT NULL,
  max_distance_km INTEGER DEFAULT 90
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  date_of_birth DATE,
  gender TEXT,
  interested_in TEXT,
  preferred_sports TEXT[],
  availability JSONB,
  avatar_urls TEXT[],
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMP,
  distance_km DOUBLE PRECISION
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Use the new function with saved preferences disabled for backward compatibility
  RETURN QUERY
  SELECT * FROM get_discovery_profiles_with_preferences(
    user_id,
    FALSE, -- Don't use saved preferences by default
    gender_filter,
    interested_in_filter,
    min_age,
    max_age,
    sports_filter,
    max_distance_km
  );
END;
$$;

GRANT EXECUTE ON FUNCTION get_discovery_profiles TO authenticated;
