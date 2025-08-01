-- RPC function for server-side discovery profile filtering
-- This replaces client-side filtering for better performance and security

CREATE OR REPLACE FUNCTION get_discovery_profiles(
  user_id UUID,
  gender_filter TEXT DEFAULT NULL,
  interested_in_filter TEXT DEFAULT NULL,
  min_age INTEGER DEFAULT NULL,
  max_age INTEGER DEFAULT NULL,
  sports_filter TEXT[] DEFAULT NULL,
  max_distance_km INTEGER DEFAULT 25
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
  -- Get current user's location and preferences for filtering
  SELECT p.lat, p.lng, p.gender, p.interested_in
  INTO current_user_lat, current_user_lng, current_user_gender, current_user_interested_in
  FROM profiles p
  WHERE p.id = user_id;

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
    END AS distance_km
  FROM profiles p
  WHERE 
    -- Exclude self
    p.id != user_id
    
    -- Exclude users already swiped (either direction)
    AND p.id NOT IN (
      SELECT CASE 
        WHEN s.swiper_id = user_id THEN s.swiped_id
        WHEN s.swiped_id = user_id THEN s.swiper_id
        ELSE NULL
      END
      FROM swipes s
      WHERE s.swiper_id = user_id OR s.swiped_id = user_id
    )
    
    -- Exclude users already matched
    AND p.id NOT IN (
      SELECT CASE 
        WHEN m.user1_id = user_id THEN m.user2_id
        WHEN m.user2_id = user_id THEN m.user1_id
        ELSE NULL
      END
      FROM matches m
      WHERE m.user1_id = user_id OR m.user2_id = user_id
    )
    
    -- Gender compatibility filter
    AND (
      gender_filter IS NULL OR
      (
        -- If current user wants specific gender, filter by that
        (gender_filter IS NOT NULL AND p.gender = gender_filter) AND
        -- If target user has preference, ensure current user matches it
        (p.interested_in = 'any' OR 
         (p.interested_in = 'men' AND current_user_gender = 'man') OR
         (p.interested_in = 'women' AND current_user_gender = 'woman'))
      )
    )
    
    -- Interested_in compatibility filter  
    AND (
      interested_in_filter IS NULL OR
      interested_in_filter = 'any' OR
      (interested_in_filter = 'men' AND p.gender = 'man') OR
      (interested_in_filter = 'women' AND p.gender = 'woman')
    )
    
    -- Age filter using date_of_birth
    AND (
      (min_age IS NULL OR EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth)) >= min_age) AND
      (max_age IS NULL OR EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth)) <= max_age)
    )
    
    -- Sports compatibility filter (at least one common sport)
    AND (
      sports_filter IS NULL OR
      sports_filter = '{}' OR
      p.preferred_sports && sports_filter
    )
    
    -- Distance filter (only if both users have coordinates)
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
    RAISE NOTICE 'Error in get_discovery_profiles: %', SQLERRM;
    RETURN;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_discovery_profiles TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION get_discovery_profiles IS 
'Server-side discovery profile filtering with distance calculation. 
Excludes already swiped/matched users and applies gender, age, sports, and location filters.
Returns up to 25 profiles ordered by proximity.';
