-- DEBUG VERSION: Simplified RPC function to isolate filtering issues
-- Use this temporarily to debug why no profiles are appearing

CREATE OR REPLACE FUNCTION get_discovery_profiles_debug(
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
  availability TEXT[],
  avatar_urls TEXT[],
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ,
  distance_km DOUBLE PRECISION,
  debug_info TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_lat DOUBLE PRECISION;
  current_user_lng DOUBLE PRECISION;
  current_user_gender TEXT;
  current_user_interested_in TEXT;
  total_profiles INTEGER;
  profiles_after_self_exclusion INTEGER;
BEGIN
  -- Get current user's location and preferences for filtering
  SELECT p.lat, p.lng, p.gender, p.interested_in
  INTO current_user_lat, current_user_lng, current_user_gender, current_user_interested_in
  FROM profiles p
  WHERE p.id = user_id;

  -- Count total profiles for debugging
  SELECT COUNT(*) INTO total_profiles FROM profiles;
  SELECT COUNT(*) INTO profiles_after_self_exclusion FROM profiles WHERE id != user_id;

  -- SIMPLIFIED QUERY - Only basic filters to debug
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
    -- Calculate distance using Haversine formula if both users have coordinates
    CASE 
      WHEN current_user_lat IS NOT NULL AND current_user_lng IS NOT NULL 
           AND p.lat IS NOT NULL AND p.lng IS NOT NULL THEN
        -- Haversine formula for distance calculation
        6371 * acos(
          cos(radians(current_user_lat)) * 
          cos(radians(p.lat)) * 
          cos(radians(p.lng) - radians(current_user_lng)) + 
          sin(radians(current_user_lat)) * 
          sin(radians(p.lat))
        )
      ELSE NULL
    END AS distance_km,
    -- Debug information
    CONCAT(
      'Total:', total_profiles, 
      ' | After self-exclusion:', profiles_after_self_exclusion,
      ' | User coords:', current_user_lat, ',', current_user_lng,
      ' | Profile coords:', p.lat, ',', p.lng,
      ' | User gender:', current_user_gender,
      ' | Profile gender:', p.gender
    ) AS debug_info
  FROM profiles p
  WHERE 
    -- ONLY exclude self for now
    p.id != user_id
    
    -- Simple distance filter (if coordinates exist)
    AND (
      max_distance_km IS NULL OR
      current_user_lat IS NULL OR current_user_lng IS NULL OR
      p.lat IS NULL OR p.lng IS NULL OR
      -- Apply distance filter using Haversine formula
      6371 * acos(
        cos(radians(current_user_lat)) * 
        cos(radians(p.lat)) * 
        cos(radians(p.lng) - radians(current_user_lng)) + 
        sin(radians(current_user_lat)) * 
        sin(radians(p.lat))
      ) <= max_distance_km
    )
  
  -- Order by distance (closest first), then by most recent
  ORDER BY 
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
      ELSE 999999 -- Put profiles without location at the end
    END ASC,
    p.created_at DESC
  
  -- Limit results for performance
  LIMIT 25;

EXCEPTION
  WHEN OTHERS THEN
    -- Log error (you can create a logs table for this)
    RAISE NOTICE 'Error in get_discovery_profiles_debug: %', SQLERRM;
    RETURN;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_discovery_profiles_debug TO authenticated;

-- MINIMAL DEBUG VERSION: Shows exactly what's filtering out profiles
CREATE OR REPLACE FUNCTION get_discovery_profiles_minimal_debug(
  user_id UUID,
  max_distance_km INTEGER DEFAULT 90
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  gender TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  distance_km DOUBLE PRECISION,
  debug_step TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_lat DOUBLE PRECISION;
  current_user_lng DOUBLE PRECISION;
  total_profiles INTEGER;
  after_self_exclusion INTEGER;
BEGIN
  -- Get current user's location
  SELECT p.lat, p.lng
  INTO current_user_lat, current_user_lng
  FROM profiles p
  WHERE p.id = user_id;

  -- Count profiles at each step
  SELECT COUNT(*) INTO total_profiles FROM profiles;
  SELECT COUNT(*) INTO after_self_exclusion FROM profiles WHERE id != user_id;

  -- Return ALL profiles except self with debug info
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.gender,
    p.lat,
    p.lng,
    -- Calculate distance
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
    END AS distance_km,
    -- Debug step info
    CONCAT(
      'Total:', total_profiles, 
      ' | After self:', after_self_exclusion,
      ' | User:', current_user_lat, ',', current_user_lng,
      ' | This profile:', p.lat, ',', p.lng,
      ' | Distance calc possible:', 
      CASE WHEN current_user_lat IS NOT NULL AND current_user_lng IS NOT NULL 
                AND p.lat IS NOT NULL AND p.lng IS NOT NULL 
           THEN 'YES' ELSE 'NO' END
    ) AS debug_step
  FROM profiles p
  WHERE p.id != user_id  -- ONLY exclude self
  ORDER BY p.created_at DESC
  LIMIT 10;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in minimal debug: %', SQLERRM;
    RETURN;
END;
$$;

GRANT EXECUTE ON FUNCTION get_discovery_profiles_minimal_debug TO authenticated;

-- RPC function for server-side discovery profile filtering
-- This replaces client-side filtering for better performance and security

DROP FUNCTION IF EXISTS get_discovery_profiles(UUID, TEXT, TEXT, INTEGER, INTEGER, TEXT[], INTEGER);

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
DECLARE
  current_user_lat DOUBLE PRECISION;
  current_user_lng DOUBLE PRECISION;
  current_user_gender TEXT;
  current_user_interested_in TEXT;
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
    p.id != user_id
    
    -- Exclude users already swiped (bidirectional check)
    AND NOT EXISTS (
      SELECT 1 FROM swipes s 
      WHERE (s.swiper_id = user_id AND s.swiped_id = p.id)
         OR (s.swiper_id = p.id AND s.swiped_id = user_id)
    )
    
    -- Exclude users already matched (bidirectional check)
    AND NOT EXISTS (
      SELECT 1 FROM matches m 
      WHERE (m.user_a = user_id AND m.user_b = p.id)
         OR (m.user_a = p.id AND m.user_b = user_id)
    )
    
    -- MUTUAL INTEREST COMPATIBILITY LOGIC
    -- This ensures both users are compatible with each other's preferences
    AND (
      -- Case 1: No specific interest filter (show all mutual matches)
      interested_in_filter IS NULL OR interested_in_filter = 'any' OR
      
      -- Case 2: Specific interest filter - check mutual compatibility
      (
        -- Part A: User is interested in the profile's gender
        (
          (interested_in_filter = 'men' AND p.gender = 'man') OR
          (interested_in_filter = 'women' AND p.gender = 'woman')
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
      (min_age IS NULL OR EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth)) >= min_age) AND
      (max_age IS NULL OR EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth)) <= max_age)
    )
    
    -- Sports compatibility filter (array overlap)
    AND (
      sports_filter IS NULL OR
      array_length(sports_filter, 1) IS NULL OR
      array_length(sports_filter, 1) = 0 OR
      p.preferred_sports && sports_filter
    )
    
    -- Distance filter using Haversine formula
    AND (
      max_distance_km IS NULL OR
      current_user_lat IS NULL OR current_user_lng IS NULL OR
      p.lat IS NULL OR p.lng IS NULL OR
      6371 * acos(
        cos(radians(current_user_lat)) * 
        cos(radians(p.lat)) * 
        cos(radians(p.lng) - radians(current_user_lng)) + 
        sin(radians(current_user_lat)) * 
        sin(radians(p.lat))
      ) <= max_distance_km
    )
  
  -- Order by proximity (closest first), then by most recent profiles
  ORDER BY 
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
      ELSE 999999 -- Put profiles without location at the end
    END ASC,
    p.created_at DESC
  
  -- Limit results for performance
  LIMIT 25;

EXCEPTION
  WHEN OTHERS THEN
    -- Log error and return empty result
    RAISE NOTICE 'Error in get_discovery_profiles: %', SQLERRM;
    RETURN;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_discovery_profiles TO authenticated;

-- Add function documentation
COMMENT ON FUNCTION get_discovery_profiles IS 
'Returns discovery profiles filtered by mutual interest compatibility, age, sports, and distance. 
Ensures bidirectional compatibility: user interested in profile AND profile interested in user.
Excludes already swiped and matched users. Orders by proximity and recency.';

-- Example usage:
-- SELECT * FROM get_discovery_profiles(
--   'user-uuid-here'::UUID,
--   NULL,           -- gender_filter (deprecated, use interested_in_filter)
--   'women',        -- interested_in_filter: 'men', 'women', or 'any'
--   18,             -- min_age
--   35,             -- max_age
--   ARRAY['Tennis', 'Football'], -- sports_filter
--   25              -- max_distance_km
-- );
