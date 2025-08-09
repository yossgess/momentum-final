-- Debug script to check why get_discovery_profiles_batch returns 0 profiles
-- Run this in Supabase SQL Editor to debug the issue

-- Step 1: Check if user exists and has profile data
SELECT 'User Profile Check' as step, p.* 
FROM profiles p 
WHERE p.id = 'de3fed90-cb12-4727-98ce-4677e32207b8';

-- Step 2: Check user's filter preferences
SELECT 'Filter Preferences Check' as step, fp.* 
FROM filter_preferences fp 
WHERE fp.user_id = 'de3fed90-cb12-4727-98ce-4677e32207b8';

-- Step 3: Count total profiles in database (excluding self)
SELECT 'Total Profiles Count' as step, COUNT(*) as total_profiles
FROM profiles p 
WHERE p.id != 'de3fed90-cb12-4727-98ce-4677e32207b8';

-- Step 4: Check profiles with basic filters only (age 18-65)
SELECT 'Age Filter Check' as step, COUNT(*) as profiles_in_age_range
FROM profiles p 
WHERE p.id != 'de3fed90-cb12-4727-98ce-4677e32207b8'
  AND EXTRACT(year FROM age(CURRENT_DATE, p.date_of_birth))::INTEGER BETWEEN 18 AND 65;

-- Step 5: Check profiles with gender compatibility
WITH user_data AS (
  SELECT p.gender as user_gender, fp.interested_in as user_interested_in
  FROM profiles p
  LEFT JOIN filter_preferences fp ON fp.user_id = p.id
  WHERE p.id = 'de3fed90-cb12-4727-98ce-4677e32207b8'
)
SELECT 'Gender Compatibility Check' as step, COUNT(*) as compatible_profiles
FROM profiles p
LEFT JOIN filter_preferences fp_candidate ON fp_candidate.user_id = p.id
CROSS JOIN user_data ud
WHERE p.id != 'de3fed90-cb12-4727-98ce-4677e32207b8'
  AND EXTRACT(year FROM age(CURRENT_DATE, p.date_of_birth))::INTEGER BETWEEN 18 AND 65
  AND (
    -- User interested in anyone OR specific gender match
    COALESCE(ud.user_interested_in, 'any') = 'any' OR
    (
      (COALESCE(ud.user_interested_in, 'any') = 'men' AND p.gender = 'man') OR
      (COALESCE(ud.user_interested_in, 'any') = 'women' AND p.gender = 'woman')
    )
  );

-- Step 6: Test the actual batch function with debug
SELECT 'Batch Function Test' as step, COUNT(*) as returned_profiles
FROM get_discovery_profiles_batch('de3fed90-cb12-4727-98ce-4677e32207b8', 50, 0);

-- Step 7: Check if there are any profiles at all with basic data
SELECT 'Basic Profile Data Check' as step, 
       COUNT(*) as total_profiles,
       COUNT(CASE WHEN date_of_birth IS NOT NULL THEN 1 END) as profiles_with_dob,
       COUNT(CASE WHEN gender IS NOT NULL THEN 1 END) as profiles_with_gender,
       COUNT(CASE WHEN lat IS NOT NULL AND lng IS NOT NULL THEN 1 END) as profiles_with_location
FROM profiles 
WHERE id != 'de3fed90-cb12-4727-98ce-4677e32207b8';

-- Step 8: Sample of actual profile data (first 3 profiles)
SELECT 'Sample Profile Data' as step, 
       id, full_name, date_of_birth, gender, 
       EXTRACT(year FROM age(CURRENT_DATE, date_of_birth))::INTEGER as calculated_age,
       lat, lng, preferred_sports
FROM profiles 
WHERE id != 'de3fed90-cb12-4727-98ce-4677e32207b8'
LIMIT 3;
