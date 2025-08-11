-- Temporary fix: Create get_discovery_profiles_optimized as a wrapper around get_discovery_profiles_batch
-- This will prevent the app from crashing while we investigate the root cause

CREATE OR REPLACE FUNCTION get_discovery_profiles_optimized(user_id UUID)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  avatar_urls TEXT[],
  gender TEXT,
  date_of_birth DATE,
  interested_in TEXT,
  preferred_sports TEXT[],
  availability JSONB,
  created_at TIMESTAMPTZ,
  lat DECIMAL,
  lng DECIMAL,
  distance_km DECIMAL,
  user_sports TEXT[],
  common_sports TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Simply call the batch function with default parameters
  RETURN QUERY
  SELECT * FROM get_discovery_profiles_batch(
    user_id := get_discovery_profiles_optimized.user_id,
    limit_count := 10,
    offset_count := 0
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_discovery_profiles_optimized TO authenticated;

-- Add comment explaining this is a temporary wrapper
COMMENT ON FUNCTION get_discovery_profiles_optimized IS 'Temporary wrapper around get_discovery_profiles_batch to prevent app crashes. Should be removed once root cause is found.';
