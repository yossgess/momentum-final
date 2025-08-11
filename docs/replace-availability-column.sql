-- Replace availability column with new slot-based format and add random mock data
-- This script completely replaces the old availability column with a new slot-based format

BEGIN;

-- Step 1: Drop the old availability column
ALTER TABLE profiles DROP COLUMN IF EXISTS availability;

-- Step 2: Create new availability column with slot-based format
ALTER TABLE profiles ADD COLUMN availability JSONB DEFAULT '{
  "days": [],
  "periods": [],
  "slots": []
}'::jsonb;

-- Step 3: Create a function to generate random availability slots
CREATE OR REPLACE FUNCTION generate_random_availability()
RETURNS JSONB AS $$
DECLARE
    days_array TEXT[] := ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    periods_array TEXT[] := ARRAY['morning', 'afternoon', 'evening'];
    selected_slots TEXT[] := '{}';
    unique_days TEXT[] := '{}';
    unique_periods TEXT[] := '{}';
    num_slots INTEGER;
    random_day TEXT;
    random_period TEXT;
    slot_key TEXT;
    i INTEGER;
BEGIN
    -- Generate between 2 and 8 random slots per user
    num_slots := 2 + floor(random() * 7)::INTEGER;
    
    -- Generate unique random slots
    FOR i IN 1..num_slots LOOP
        -- Select random day and period
        random_day := days_array[1 + floor(random() * array_length(days_array, 1))::INTEGER];
        random_period := periods_array[1 + floor(random() * array_length(periods_array, 1))::INTEGER];
        slot_key := random_day || '-' || random_period;
        
        -- Add slot if not already present
        IF NOT (slot_key = ANY(selected_slots)) THEN
            selected_slots := array_append(selected_slots, slot_key);
            
            -- Add to unique days and periods
            IF NOT (random_day = ANY(unique_days)) THEN
                unique_days := array_append(unique_days, random_day);
            END IF;
            
            IF NOT (random_period = ANY(unique_periods)) THEN
                unique_periods := array_append(unique_periods, random_period);
            END IF;
        END IF;
    END LOOP;
    
    -- Return JSON structure
    RETURN jsonb_build_object(
        'days', to_jsonb(unique_days),
        'periods', to_jsonb(unique_periods),
        'slots', to_jsonb(selected_slots)
    );
END;
$$ LANGUAGE plpgsql;

-- Step 4: Update all existing profiles with random availability data
UPDATE profiles 
SET availability = generate_random_availability()
WHERE id IS NOT NULL;

-- Step 5: Add some specific test profiles with known availability patterns
INSERT INTO profiles (
    id,
    full_name,
    date_of_birth,
    gender,
    availability,
    avatar_urls,
    created_at
) VALUES 
-- Morning person - available weekday mornings
(
    'morning-person-test',
    'Morning Person',
    '1990-05-15',
    'woman',
    '{
        "days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
        "periods": ["morning"],
        "slots": ["monday-morning", "tuesday-morning", "wednesday-morning", "thursday-morning", "friday-morning"]
    }'::jsonb,
    '["https://example.com/morning-person.jpg"]',
    NOW()
),
-- Evening person - available weekday evenings
(
    'evening-person-test',
    'Evening Person',
    '1988-12-03',
    'man',
    '{
        "days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
        "periods": ["evening"],
        "slots": ["monday-evening", "tuesday-evening", "wednesday-evening", "thursday-evening", "friday-evening"]
    }'::jsonb,
    '["https://example.com/evening-person.jpg"]',
    NOW()
),
-- Weekend warrior - available weekends all day
(
    'weekend-warrior-test',
    'Weekend Warrior',
    '1985-07-20',
    'woman',
    '{
        "days": ["saturday", "sunday"],
        "periods": ["morning", "afternoon", "evening"],
        "slots": ["saturday-morning", "saturday-afternoon", "saturday-evening", "sunday-morning", "sunday-afternoon", "sunday-evening"]
    }'::jsonb,
    '["https://example.com/weekend-warrior.jpg"]',
    NOW()
),
-- Flexible schedule - scattered availability
(
    'flexible-schedule-test',
    'Flexible Schedule',
    '1993-03-10',
    'man',
    '{
        "days": ["monday", "wednesday", "friday", "sunday"],
        "periods": ["morning", "afternoon", "evening"],
        "slots": ["monday-afternoon", "wednesday-morning", "friday-evening", "sunday-afternoon"]
    }'::jsonb,
    '["https://example.com/flexible-schedule.jpg"]',
    NOW()
),
-- Lunch break person - midday availability
(
    'lunch-break-test',
    'Lunch Break Person',
    '1991-11-25',
    'woman',
    '{
        "days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
        "periods": ["afternoon"],
        "slots": ["monday-afternoon", "tuesday-afternoon", "wednesday-afternoon", "thursday-afternoon", "friday-afternoon"]
    }'::jsonb,
    '["https://example.com/lunch-break.jpg"]',
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    availability = EXCLUDED.availability,
    full_name = EXCLUDED.full_name,
    date_of_birth = EXCLUDED.date_of_birth,
    gender = EXCLUDED.gender,
    avatar_urls = EXCLUDED.avatar_urls;

-- Step 6: Clean up the function
DROP FUNCTION generate_random_availability();

-- Step 7: Create index for efficient slot-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_availability_slots 
ON profiles USING GIN ((availability->'slots'));

-- Step 8: Add constraints to ensure data integrity
ALTER TABLE profiles 
ADD CONSTRAINT availability_structure_check 
CHECK (
    availability ? 'days' AND 
    availability ? 'periods' AND 
    availability ? 'slots' AND
    jsonb_typeof(availability->'days') = 'array' AND
    jsonb_typeof(availability->'periods') = 'array' AND
    jsonb_typeof(availability->'slots') = 'array'
);

-- Step 9: Verify the new availability data
SELECT 
    id,
    full_name,
    availability->'slots' as individual_slots,
    jsonb_array_length(availability->'slots') as slot_count,
    jsonb_array_length(availability->'days') as unique_days,
    jsonb_array_length(availability->'periods') as unique_periods
FROM profiles 
WHERE availability IS NOT NULL
ORDER BY slot_count DESC, full_name
LIMIT 20;

-- Step 10: Show availability distribution statistics
SELECT 
    'Total profiles with availability' as metric,
    COUNT(*) as count
FROM profiles 
WHERE availability ? 'slots' AND jsonb_array_length(availability->'slots') > 0

UNION ALL

SELECT 
    'Average slots per user' as metric,
    ROUND(AVG(jsonb_array_length(availability->'slots')), 2) as count
FROM profiles 
WHERE availability ? 'slots' AND jsonb_array_length(availability->'slots') > 0

UNION ALL

SELECT 
    'Most popular time period' as metric,
    COUNT(*) as count
FROM profiles,
     jsonb_array_elements_text(availability->'slots') as slot_value
WHERE availability ? 'slots'
  AND SPLIT_PART(slot_value, '-', 2) = (
      SELECT SPLIT_PART(slot_value, '-', 2)
      FROM profiles,
           jsonb_array_elements_text(availability->'slots') as slot_value
      WHERE availability ? 'slots'
      GROUP BY SPLIT_PART(slot_value, '-', 2)
      ORDER BY COUNT(*) DESC
      LIMIT 1
  )

UNION ALL

SELECT 
    'Most popular day' as metric,
    COUNT(*) as count
FROM profiles,
     jsonb_array_elements_text(availability->'slots') as slot_value
WHERE availability ? 'slots'
  AND SPLIT_PART(slot_value, '-', 1) = (
      SELECT SPLIT_PART(slot_value, '-', 1)
      FROM profiles,
           jsonb_array_elements_text(availability->'slots') as slot_value
      WHERE availability ? 'slots'
      GROUP BY SPLIT_PART(slot_value, '-', 1)
      ORDER BY COUNT(*) DESC
      LIMIT 1
  );

-- Step 11: Example queries for testing the new format

-- Find users available on Monday morning
SELECT 
    id, 
    full_name, 
    availability->'slots' as slots
FROM profiles 
WHERE availability->'slots' ? 'monday-morning'
LIMIT 5;

-- Find users with any evening availability
SELECT 
    id, 
    full_name, 
    availability->'slots' as slots
FROM profiles 
WHERE EXISTS (
    SELECT 1 
    FROM jsonb_array_elements_text(availability->'slots') as slot
    WHERE slot LIKE '%-evening'
)
LIMIT 5;

-- Find users available on weekends
SELECT 
    id, 
    full_name, 
    availability->'slots' as slots
FROM profiles 
WHERE EXISTS (
    SELECT 1 
    FROM jsonb_array_elements_text(availability->'slots') as slot
    WHERE slot LIKE 'saturday-%' OR slot LIKE 'sunday-%'
)
LIMIT 5;

COMMIT;

-- Success message
SELECT 'Availability column successfully replaced with slot-based format and populated with random mock data!' as status;
