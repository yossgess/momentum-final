-- Fixed RPC function that works with the new schema separation
-- profiles table: identity data (no interested_in, no preferred_sports)
-- filter_preferences table: filter data (interested_in, sports)

CREATE OR REPLACE FUNCTION get_discovery_profiles_optimized(
  user_id UUID
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  date_of_birth DATE,
  gender TEXT,
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
  
  -- Filter preferences from database
  filter_interested_in TEXT;
  filter_min_age INTEGER;
  filter_max_age INTEGER;
  filter_sports TEXT[];
  filter_max_distance_km INTEGER;
BEGIN
  -- Get current user's profile data for mutual compatibility and location
  SELECT p.lat, p.lng, p.gender
  INTO current_user_lat, current_user_lng, current_user_gender
  FROM profiles p
  WHERE p.id = get_discovery_profiles_optimized.user_id;
  
  -- Get current user's interested_in from filter_preferences table
  SELECT fp.interested_in
  INTO current_user_interested_in
  FROM filter_preferences fp
  WHERE fp.user_id = get_discovery_profiles_optimized.user_id;

  -- If user not found, return empty result
  IF current_user_gender IS NULL THEN
    RAISE NOTICE 'User profile not found for ID: %', get_discovery_profiles_optimized.user_id;
    RETURN;
  END IF;

  -- Load filter preferences from filter_preferences table
  SELECT 
    fp.interested_in,
    fp.age_min,
    fp.age_max,
    fp.sports,
    fp.distance_km
  INTO 
    filter_interested_in,
    filter_min_age,
    filter_max_age,
    filter_sports,
    filter_max_distance_km
  FROM filter_preferences fp
  WHERE fp.user_id = get_discovery_profiles_optimized.user_id;

  -- Apply sensible defaults if no preferences found
  IF filter_interested_in IS NULL THEN
    filter_interested_in := 'any';
    filter_min_age := 18;
    filter_max_age := 65;
    filter_sports := ARRAY[]::TEXT[];
    filter_max_distance_km := 25;
  ELSE
    -- Apply defaults for missing values
    filter_min_age := COALESCE(filter_min_age, 18);
    filter_max_age := COALESCE(filter_max_age, 65);
    filter_sports := COALESCE(filter_sports, ARRAY[]::TEXT[]);
    filter_max_distance_km := COALESCE(filter_max_distance_km, 25);
  END IF;

  RAISE NOTICE 'Using filters: interested_in=%, age_min=%, age_max=%, sports=%, distance_km=%', 
    filter_interested_in, filter_min_age, filter_max_age, filter_sports, filter_max_distance_km;

  -- Return filtered profiles with distance calculation
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.date_of_birth,
    p.gender,
    p.availability,
    p.avatar_urls,
    p.lat,
    p.lng,
    p.created_at,
    -- Calculate distance using Haversine formula (in kilometers)
    CASE 
      WHEN current_user_lat IS NOT NULL AND current_user_lng IS NOT NULL 
           AND p.lat IS NOT NULL AND p.lng IS NOT NULL THEN
        6371 * acos(
          LEAST(1.0, 
            cos(radians(current_user_lat)) * 
            cos(radians(p.lat)) * 
            cos(radians(p.lng) - radians(current_user_lng)) + 
            sin(radians(current_user_lat)) * 
            sin(radians(p.lat))
          )
        )
      ELSE NULL
    END AS distance_km
  FROM profiles p
  LEFT JOIN filter_preferences fp_candidate ON fp_candidate.user_id = p.id
  WHERE 
    -- Exclude self
    p.id != get_discovery_profiles_optimized.user_id
    
    -- Exclude already swiped profiles
    AND p.id NOT IN (
      SELECT swiped_id 
      FROM swipes 
      WHERE swiper_id = get_discovery_profiles_optimized.user_id
    )
    
    -- MUTUAL INTEREST COMPATIBILITY LOGIC
    -- Both users must be compatible with each other's preferences
    AND (
      -- Case 1: User has no specific interest preference (interested in anyone)
      filter_interested_in = 'any' OR
      
      -- Case 2: User has specific interest - check mutual compatibility
      (
        -- Part A: User is interested in the profile's gender
        (
          (filter_interested_in = 'men' AND p.gender = 'man') OR
          (filter_interested_in = 'women' AND p.gender = 'woman')
        )
        AND
        -- Part B: Profile is interested in the user's gender (or anyone)
        (
          COALESCE(fp_candidate.interested_in, 'any') = 'any' OR
          (COALESCE(fp_candidate.interested_in, 'any') = 'men' AND current_user_gender = 'man') OR
          (COALESCE(fp_candidate.interested_in, 'any') = 'women' AND current_user_gender = 'woman')
        )
      )
    )
    
    -- Age filter based on calculated age from date of birth
    AND (
      EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth)) >= filter_min_age AND
      EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth)) <= filter_max_age
    )
    
    -- Sports compatibility filter (array overlap)
    -- If user has no sports preferences, show all profiles
    -- If user has sports preferences, show profiles with at least one matching sport
    AND (
      array_length(filter_sports, 1) IS NULL OR
      array_length(filter_sports, 1) = 0 OR
      COALESCE(fp_candidate.sports, ARRAY[]::TEXT[]) && filter_sports
    )
    
    -- Distance filter using Haversine formula
    -- Only apply if both user and profile have location data
    AND (
      current_user_lat IS NULL OR current_user_lng IS NULL OR
      p.lat IS NULL OR p.lng IS NULL OR
      6371 * acos(
        LEAST(1.0,
          cos(radians(current_user_lat)) * 
          cos(radians(p.lat)) * 
          cos(radians(p.lng) - radians(current_user_lng)) + 
          sin(radians(current_user_lat)) * 
          sin(radians(p.lat))
        )
      ) <= filter_max_distance_km
    )
    
  ORDER BY 
    -- Prioritize profiles with location data and closer distance
    CASE 
      WHEN current_user_lat IS NOT NULL AND current_user_lng IS NOT NULL 
           AND p.lat IS NOT NULL AND p.lng IS NOT NULL THEN
        6371 * acos(
          LEAST(1.0,
            cos(radians(current_user_lat)) * 
            cos(radians(p.lat)) * 
            cos(radians(p.lng) - radians(current_user_lng)) + 
            sin(radians(current_user_lat)) * 
            sin(radians(p.lat))
          )
        )
      ELSE 999999 -- Put profiles without location at the end
    END ASC,
    p.created_at DESC
  LIMIT 50; -- Reasonable limit to avoid performance issues

END;
$$;
