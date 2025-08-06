-- Clean up old discovery profile functions that are no longer needed
-- We now use get_discovery_profiles_optimized as the primary function

-- Drop the original get_discovery_profiles function with all its parameters
DROP FUNCTION IF EXISTS get_discovery_profiles(
  user_id UUID,
  gender_filter TEXT,
  interested_in_filter TEXT,
  min_age INTEGER,
  max_age INTEGER,
  sports_filter TEXT[],
  max_distance_km INTEGER
);

-- Drop the debug version that was used for troubleshooting
DROP FUNCTION IF EXISTS get_discovery_profiles_debug(
  user_id UUID,
  gender_filter TEXT,
  interested_in_filter TEXT,
  min_age INTEGER,
  max_age INTEGER,
  sports_filter TEXT[],
  max_distance_km INTEGER
);

-- Drop the minimal debug version that was used for testing
DROP FUNCTION IF EXISTS get_discovery_profiles_minimal_debug(
  user_id UUID,
  max_distance_km INTEGER
);

-- Keep get_discovery_profiles_from_preferences as it's a useful wrapper
-- But we could drop it if you prefer to use only get_discovery_profiles_optimized
-- Uncomment the next lines if you want to remove it too:
-- DROP FUNCTION IF EXISTS get_discovery_profiles_from_preferences(user_id UUID);

-- Log the cleanup
DO $$
BEGIN
  RAISE NOTICE 'Cleaned up old discovery profile functions:';
  RAISE NOTICE '- get_discovery_profiles (original with parameters)';
  RAISE NOTICE '- get_discovery_profiles_debug (debug version)';
  RAISE NOTICE '- get_discovery_profiles_minimal_debug (minimal debug)';
  RAISE NOTICE 'Kept functions:';
  RAISE NOTICE '- get_discovery_profiles_optimized (primary function)';
  RAISE NOTICE '- get_discovery_profiles_from_preferences (wrapper)';
  RAISE NOTICE '- handle_mutual_challenge (trigger - unrelated)';
END $$;

-- Verify remaining functions
SELECT 
  routine_name,
  routine_type,
  specific_name
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE '%discovery%'
ORDER BY routine_name;
