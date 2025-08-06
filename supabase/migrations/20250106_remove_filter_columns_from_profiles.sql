-- Remove filter preference columns from profiles table
-- These columns are now handled by the separate filter_preferences table

-- First, check if columns exist before attempting to drop them
-- This prevents errors if the columns were never added to the profiles table

DO $$ 
BEGIN
    -- Drop interested_in column if it exists (moved to filter_preferences table)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'interested_in'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE profiles DROP COLUMN interested_in;
        RAISE NOTICE 'Dropped interested_in column from profiles table';
    ELSE
        RAISE NOTICE 'Column interested_in does not exist in profiles table';
    END IF;

    -- Drop filter_age_min column if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'filter_age_min'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE profiles DROP COLUMN filter_age_min;
        RAISE NOTICE 'Dropped filter_age_min column from profiles table';
    ELSE
        RAISE NOTICE 'Column filter_age_min does not exist in profiles table';
    END IF;

    -- Drop filter_age_max column if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'filter_age_max'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE profiles DROP COLUMN filter_age_max;
        RAISE NOTICE 'Dropped filter_age_max column from profiles table';
    ELSE
        RAISE NOTICE 'Column filter_age_max does not exist in profiles table';
    END IF;

    -- Drop filter_sports column if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'filter_sports'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE profiles DROP COLUMN filter_sports;
        RAISE NOTICE 'Dropped filter_sports column from profiles table';
    ELSE
        RAISE NOTICE 'Column filter_sports does not exist in profiles table';
    END IF;

    -- Drop preferred_sports column if it exists (moved to filter_preferences table as 'sports')
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'preferred_sports'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE profiles DROP COLUMN preferred_sports;
        RAISE NOTICE 'Dropped preferred_sports column from profiles table';
    ELSE
        RAISE NOTICE 'Column preferred_sports does not exist in profiles table';
    END IF;

    -- Drop filter_distance_km column if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'filter_distance_km'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE profiles DROP COLUMN filter_distance_km;
        RAISE NOTICE 'Dropped filter_distance_km column from profiles table';
    ELSE
        RAISE NOTICE 'Column filter_distance_km does not exist in profiles table';
    END IF;

    -- Drop the constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'profiles' 
        AND constraint_name = 'filter_age_range_valid'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE profiles DROP CONSTRAINT filter_age_range_valid;
        RAISE NOTICE 'Dropped filter_age_range_valid constraint from profiles table';
    ELSE
        RAISE NOTICE 'Constraint filter_age_range_valid does not exist in profiles table';
    END IF;

END $$;

-- Add comment for documentation
COMMENT ON TABLE profiles IS 'User profiles table - filter preferences now handled by separate filter_preferences table';
