-- Migration: Update availability column to support slot-based selection
-- This script updates the profiles table to support individual slot selections
-- instead of the Cartesian product approach

-- Step 1: Add a new column for individual slots (temporary)
ALTER TABLE profiles 
ADD COLUMN availability_slots TEXT[] DEFAULT '{}';

-- Step 2: Create a function to migrate existing availability data
CREATE OR REPLACE FUNCTION migrate_availability_to_slots()
RETURNS void AS $$
DECLARE
    profile_record RECORD;
    day_item TEXT;
    period_item TEXT;
    slot_key TEXT;
    slots_array TEXT[] := '{}';
BEGIN
    -- Loop through all profiles with availability data
    FOR profile_record IN 
        SELECT id, availability 
        FROM profiles 
        WHERE availability IS NOT NULL 
        AND availability::jsonb ? 'days' 
        AND availability::jsonb ? 'periods'
    LOOP
        -- Reset slots array for each profile
        slots_array := '{}';
        
        -- Extract days and periods from JSON
        FOR day_item IN 
            SELECT jsonb_array_elements_text(profile_record.availability::jsonb->'days')
        LOOP
            FOR period_item IN 
                SELECT jsonb_array_elements_text(profile_record.availability::jsonb->'periods')
            LOOP
                -- Create individual slot key
                slot_key := day_item || '-' || period_item;
                slots_array := array_append(slots_array, slot_key);
            END LOOP;
        END LOOP;
        
        -- Update the profile with individual slots
        UPDATE profiles 
        SET availability_slots = slots_array
        WHERE id = profile_record.id;
        
        RAISE NOTICE 'Migrated profile % with % slots', profile_record.id, array_length(slots_array, 1);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Run the migration function
SELECT migrate_availability_to_slots();

-- Step 4: Update the availability column structure to include slots
UPDATE profiles 
SET availability = jsonb_set(
    COALESCE(availability::jsonb, '{}'::jsonb),
    '{slots}',
    to_jsonb(availability_slots)
)
WHERE availability_slots IS NOT NULL AND array_length(availability_slots, 1) > 0;

-- Step 5: Clean up - drop the temporary column and function
DROP COLUMN IF EXISTS availability_slots;
DROP FUNCTION IF EXISTS migrate_availability_to_slots();

-- Step 6: Create sample data with new slot format for testing
INSERT INTO profiles (
    id,
    full_name,
    date_of_birth,
    gender,
    availability,
    avatar_urls,
    created_at
) VALUES 
(
    'test-slot-user-1',
    'Test Slot User 1',
    '1995-01-15',
    'woman',
    '{
        "days": ["monday", "wednesday", "friday"],
        "periods": ["morning", "evening"],
        "slots": ["monday-morning", "wednesday-evening", "friday-morning"]
    }'::jsonb,
    '{"https://example.com/avatar1.jpg"}',
    NOW()
),
(
    'test-slot-user-2',
    'Test Slot User 2',
    '1992-08-22',
    'man',
    '{
        "days": ["tuesday", "thursday", "saturday"],
        "periods": ["afternoon", "evening"],
        "slots": ["tuesday-afternoon", "thursday-evening", "saturday-afternoon", "saturday-evening"]
    }'::jsonb,
    '{"https://example.com/avatar2.jpg"}',
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    availability = EXCLUDED.availability,
    full_name = EXCLUDED.full_name,
    date_of_birth = EXCLUDED.date_of_birth,
    gender = EXCLUDED.gender,
    avatar_urls = EXCLUDED.avatar_urls;

-- Step 7: Verify the migration
SELECT 
    id,
    full_name,
    availability->'slots' as individual_slots,
    jsonb_array_length(availability->'slots') as slot_count
FROM profiles 
WHERE availability ? 'slots' 
AND jsonb_array_length(availability->'slots') > 0
ORDER BY created_at DESC
LIMIT 10;

-- Step 8: Create an index for efficient slot-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_availability_slots 
ON profiles USING GIN ((availability->'slots'));

COMMENT ON INDEX idx_profiles_availability_slots IS 'Index for efficient querying of individual availability slots';

-- Step 9: Example queries for the new slot format

-- Find users available on Monday morning
SELECT id, full_name, availability->'slots' as slots
FROM profiles 
WHERE availability->'slots' ? 'monday-morning';

-- Find users with any evening availability
SELECT id, full_name, availability->'slots' as slots
FROM profiles 
WHERE EXISTS (
    SELECT 1 
    FROM jsonb_array_elements_text(availability->'slots') as slot
    WHERE slot LIKE '%-evening'
);

-- Count availability by time period
SELECT 
    SPLIT_PART(slot_value, '-', 2) as period,
    COUNT(*) as user_count
FROM profiles,
     jsonb_array_elements_text(availability->'slots') as slot_value
WHERE availability ? 'slots'
GROUP BY SPLIT_PART(slot_value, '-', 2)
ORDER BY user_count DESC;

-- Count availability by day
SELECT 
    SPLIT_PART(slot_value, '-', 1) as day,
    COUNT(*) as user_count
FROM profiles,
     jsonb_array_elements_text(availability->'slots') as slot_value
WHERE availability ? 'slots'
GROUP BY SPLIT_PART(slot_value, '-', 1)
ORDER BY 
    CASE SPLIT_PART(slot_value, '-', 1)
        WHEN 'monday' THEN 1
        WHEN 'tuesday' THEN 2
        WHEN 'wednesday' THEN 3
        WHEN 'thursday' THEN 4
        WHEN 'friday' THEN 5
        WHEN 'saturday' THEN 6
        WHEN 'sunday' THEN 7
    END;

COMMIT;
