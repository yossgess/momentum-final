-- Create Matches Between Yosri and ALL Mock Profiles
-- This script creates mutual challenges to trigger matches with all test users
-- Your ID: de3fed90-cb12-4727-98ce-4677e32207b8

-- Step 1: Clean up any existing test data for Yosri
DELETE FROM match_notifications WHERE user_id = 'de3fed90-cb12-4727-98ce-4677e32207b8';
DELETE FROM matches WHERE user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8' OR user_b = 'de3fed90-cb12-4727-98ce-4677e32207b8';
DELETE FROM swipes WHERE swiper_id = 'de3fed90-cb12-4727-98ce-4677e32207b8' OR swiped_id = 'de3fed90-cb12-4727-98ce-4677e32207b8';

-- Step 2: Create mutual challenges with ALL mock profiles
-- Each pair of swipes will trigger the handle_mutual_challenge trigger to create matches

-- Match 1: Yosri ↔ Sofia Martinez (woman)
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('de3fed90-cb12-4727-98ce-4677e32207b8', '550e8400-e29b-41d4-a716-446655440001', 'challenge', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440001', 'de3fed90-cb12-4727-98ce-4677e32207b8', 'challenge', NOW() - INTERVAL '3 days' + INTERVAL '5 minutes');

-- Match 2: Yosri ↔ David Johnson (man)
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('de3fed90-cb12-4727-98ce-4677e32207b8', '550e8400-e29b-41d4-a716-446655440002', 'challenge', NOW() - INTERVAL '2 days' - INTERVAL '8 hours'),
('550e8400-e29b-41d4-a716-446655440002', 'de3fed90-cb12-4727-98ce-4677e32207b8', 'challenge', NOW() - INTERVAL '2 days' - INTERVAL '8 hours' + INTERVAL '3 minutes');

-- Match 3: Yosri ↔ Emma Thompson (woman)
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('de3fed90-cb12-4727-98ce-4677e32207b8', '550e8400-e29b-41d4-a716-446655440003', 'challenge', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440003', 'de3fed90-cb12-4727-98ce-4677e32207b8', 'challenge', NOW() - INTERVAL '2 days' + INTERVAL '7 minutes');

-- Match 4: Yosri ↔ Marcus Williams (man)
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('de3fed90-cb12-4727-98ce-4677e32207b8', '550e8400-e29b-41d4-a716-446655440004', 'challenge', NOW() - INTERVAL '1 day' - INTERVAL '12 hours'),
('550e8400-e29b-41d4-a716-446655440004', 'de3fed90-cb12-4727-98ce-4677e32207b8', 'challenge', NOW() - INTERVAL '1 day' - INTERVAL '12 hours' + INTERVAL '2 minutes');

-- Match 5: Yosri ↔ Aria Chen (woman)
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('de3fed90-cb12-4727-98ce-4677e32207b8', '550e8400-e29b-41d4-a716-446655440005', 'challenge', NOW() - INTERVAL '1 day' - INTERVAL '6 hours'),
('550e8400-e29b-41d4-a716-446655440005', 'de3fed90-cb12-4727-98ce-4677e32207b8', 'challenge', NOW() - INTERVAL '1 day' - INTERVAL '6 hours' + INTERVAL '4 minutes');

-- Match 6: Yosri ↔ Alex Rodriguez (man)
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('de3fed90-cb12-4727-98ce-4677e32207b8', '550e8400-e29b-41d4-a716-446655440006', 'challenge', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440006', 'de3fed90-cb12-4727-98ce-4677e32207b8', 'challenge', NOW() - INTERVAL '1 day' + INTERVAL '6 minutes');

-- Match 7: Yosri ↔ Maya Patel (woman)
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('de3fed90-cb12-4727-98ce-4677e32207b8', '550e8400-e29b-41d4-a716-446655440007', 'challenge', NOW() - INTERVAL '18 hours'),
('550e8400-e29b-41d4-a716-446655440007', 'de3fed90-cb12-4727-98ce-4677e32207b8', 'challenge', NOW() - INTERVAL '18 hours' + INTERVAL '8 minutes');

-- Match 8: Yosri ↔ Jake Anderson (man)
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('de3fed90-cb12-4727-98ce-4677e32207b8', '550e8400-e29b-41d4-a716-446655440008', 'challenge', NOW() - INTERVAL '12 hours'),
('550e8400-e29b-41d4-a716-446655440008', 'de3fed90-cb12-4727-98ce-4677e32207b8', 'challenge', NOW() - INTERVAL '12 hours' + INTERVAL '1 minute');

-- Step 3: Verify all matches were created
-- This should show 8 matches for Yosri
SELECT 
    m.id as match_id,
    m.created_at as match_created_at,
    CASE 
        WHEN m.user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8' THEN p.full_name 
        ELSE p2.full_name 
    END as matched_user_name,
    CASE 
        WHEN m.user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8' THEN p.gender 
        ELSE p2.gender 
    END as matched_user_gender,
    CASE 
        WHEN m.user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8' THEN m.user_b 
        ELSE m.user_a 
    END as matched_user_id
FROM matches m
LEFT JOIN profiles p ON p.id = m.user_b AND m.user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8'
LEFT JOIN profiles p2 ON p2.id = m.user_a AND m.user_b = 'de3fed90-cb12-4727-98ce-4677e32207b8'
WHERE m.user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8' OR m.user_b = 'de3fed90-cb12-4727-98ce-4677e32207b8'
ORDER BY m.created_at DESC;

-- Step 4: Verify match notifications were created
-- This should show 8 match notifications for Yosri
SELECT 
    mn.id,
    mn.created_at,
    mn.seen,
    p.full_name as matched_user_name,
    p.gender as matched_user_gender
FROM match_notifications mn
JOIN profiles p ON p.id = mn.matched_user_id
WHERE mn.user_id = 'de3fed90-cb12-4727-98ce-4677e32207b8'
ORDER BY mn.created_at DESC;

-- Step 5: Test the get_user_matches RPC function
-- This should return all 8 matches with full profile data and distance calculations
SELECT * FROM get_user_matches('de3fed90-cb12-4727-98ce-4677e32207b8');

-- Expected Results:
-- ✅ 8 matches created between Yosri and all mock profiles
-- ✅ 8 match notifications created for Yosri  
-- ✅ get_user_matches RPC returns detailed match data with distances
-- ✅ MatchZone screen will show all 8 matches when refreshed
-- ✅ Each match card will display: name, gender, distance, match date

-- Mock Profiles Summary:
-- 1. Sofia Martinez (woman) - 1998-03-15
-- 2. David Johnson (man) - 1994-07-22  
-- 3. Emma Thompson (woman) - 2000-11-08
-- 4. Marcus Williams (man) - 1996-01-12
-- 5. Aria Chen (woman) - 2002-09-30
-- 6. Alex Rodriguez (man) - 1999-05-18
-- 7. Maya Patel (woman) - 1997-12-03
-- 8. Jake Anderson (man) - 1995-04-25
