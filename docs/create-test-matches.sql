-- Test Matches Creation Script for Momentum App
-- This script creates test matches between the current user (Yosri) and other users
-- Run this in your Supabase SQL Editor to create test data

-- Current user ID (Yosri)
-- de3fed90-cb12-4727-98ce-4677e32207b8

-- Test user IDs from profiles table:
-- 550e8400-e29b-41d4-a716-446655440001 - Sofia Martinez (woman)
-- 550e8400-e29b-41d4-a716-446655440002 - David Johnson (man)
-- 550e8400-e29b-41d4-a716-446655440003 - Emma Thompson (woman)
-- 550e8400-e29b-41d4-a716-446655440004 - Marcus Williams (man)
-- 550e8400-e29b-41d4-a716-446655440005 - Aria Chen (woman)
-- 550e8400-e29b-41d4-a716-446655440006 - Alex Rodriguez (man)
-- 550e8400-e29b-41d4-a716-446655440007 - Maya Patel (woman)
-- 550e8400-e29b-41d4-a716-446655440008 - Jake Anderson (man)

-- Step 1: Clean up any existing test data for Yosri
DELETE FROM match_notifications WHERE user_id = 'de3fed90-cb12-4727-98ce-4677e32207b8';
DELETE FROM matches WHERE user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8' OR user_b = 'de3fed90-cb12-4727-98ce-4677e32207b8';
DELETE FROM swipes WHERE swiper_id = 'de3fed90-cb12-4727-98ce-4677e32207b8' OR swiped_id = 'de3fed90-cb12-4727-98ce-4677e32207b8';

-- Step 2: Create mutual swipes to trigger matches
-- These swipes will automatically create matches via the handle_mutual_challenge trigger

-- Match 1: Yosri ↔ David Johnson (man, interested in women)
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('de3fed90-cb12-4727-98ce-4677e32207b8', '550e8400-e29b-41d4-a716-446655440002', 'challenge', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440002', 'de3fed90-cb12-4727-98ce-4677e32207b8', 'challenge', NOW() - INTERVAL '2 days' + INTERVAL '5 minutes');

-- Match 2: Yosri ↔ Marcus Williams (man, interested in women)
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('de3fed90-cb12-4727-98ce-4677e32207b8', '550e8400-e29b-41d4-a716-446655440004', 'challenge', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440004', 'de3fed90-cb12-4727-98ce-4677e32207b8', 'challenge', NOW() - INTERVAL '1 day' + INTERVAL '10 minutes');

-- Match 3: Yosri ↔ Alex Rodriguez (man, interested in women)
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('de3fed90-cb12-4727-98ce-4677e32207b8', '550e8400-e29b-41d4-a716-446655440006', 'challenge', NOW() - INTERVAL '12 hours'),
('550e8400-e29b-41d4-a716-446655440006', 'de3fed90-cb12-4727-98ce-4677e32207b8', 'challenge', NOW() - INTERVAL '12 hours' + INTERVAL '3 minutes');

-- Match 4: Yosri ↔ Jake Anderson (man, interested in women)
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('de3fed90-cb12-4727-98ce-4677e32207b8', '550e8400-e29b-41d4-a716-446655440008', 'challenge', NOW() - INTERVAL '6 hours'),
('550e8400-e29b-41d4-a716-446655440008', 'de3fed90-cb12-4727-98ce-4677e32207b8', 'challenge', NOW() - INTERVAL '6 hours' + INTERVAL '7 minutes');

-- Step 3: Add some one-way swipes (no matches) for testing
-- These won't create matches because they're not mutual

-- Yosri challenged Sofia but she hasn't responded yet
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('de3fed90-cb12-4727-98ce-4677e32207b8', '550e8400-e29b-41d4-a716-446655440001', 'challenge', NOW() - INTERVAL '3 hours');

-- Emma challenged Yosri but he hasn't responded yet
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'de3fed90-cb12-4727-98ce-4677e32207b8', 'challenge', NOW() - INTERVAL '4 hours');

-- Yosri noped Aria (no match possible)
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('de3fed90-cb12-4727-98ce-4677e32207b8', '550e8400-e29b-41d4-a716-446655440005', 'nope', NOW() - INTERVAL '8 hours');

-- Maya noped Yosri (no match possible)
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440007', 'de3fed90-cb12-4727-98ce-4677e32207b8', 'nope', NOW() - INTERVAL '10 hours');

-- Step 4: Verify the matches were created
-- This query should show 4 matches for Yosri
SELECT 
    m.id as match_id,
    m.created_at as match_created_at,
    CASE 
        WHEN m.user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8' THEN p.full_name 
        ELSE p2.full_name 
    END as matched_user_name,
    CASE 
        WHEN m.user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8' THEN m.user_b 
        ELSE m.user_a 
    END as matched_user_id
FROM matches m
LEFT JOIN profiles p ON p.id = m.user_b AND m.user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8'
LEFT JOIN profiles p2 ON p2.id = m.user_a AND m.user_b = 'de3fed90-cb12-4727-98ce-4677e32207b8'
WHERE m.user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8' OR m.user_b = 'de3fed90-cb12-4727-98ce-4677e32207b8'
ORDER BY m.created_at DESC;

-- Step 5: Verify match notifications were created
-- This query should show match notifications for Yosri
SELECT 
    mn.id,
    mn.created_at,
    mn.seen,
    p.full_name as matched_user_name
FROM match_notifications mn
JOIN profiles p ON p.id = mn.matched_user_id
WHERE mn.user_id = 'de3fed90-cb12-4727-98ce-4677e32207b8'
ORDER BY mn.created_at DESC;

-- Step 6: Test the get_user_matches RPC function
-- This should return the matches with full profile data
SELECT * FROM get_user_matches('de3fed90-cb12-4727-98ce-4677e32207b8');

-- Expected Results:
-- - 4 matches should be created between Yosri and David, Marcus, Alex, Jake
-- - 4 match notifications should be created for Yosri
-- - The get_user_matches function should return detailed match data with profiles
-- - The MatchZone screen should display these matches when you refresh

-- Note: The triggers should automatically:
-- 1. Create matches when mutual challenges exist
-- 2. Create match notifications for both users
-- 3. Handle the proper user_a/user_b ordering in matches table
