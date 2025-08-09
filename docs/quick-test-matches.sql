-- Quick Test Matches for Yosri
-- Run this in Supabase SQL Editor to create immediate test matches

-- Clean up existing data first
DELETE FROM match_notifications WHERE user_id = 'de3fed90-cb12-4727-98ce-4677e32207b8';
DELETE FROM matches WHERE user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8' OR user_b = 'de3fed90-cb12-4727-98ce-4677e32207b8';
DELETE FROM swipes WHERE swiper_id = 'de3fed90-cb12-4727-98ce-4677e32207b8' OR swiped_id = 'de3fed90-cb12-4727-98ce-4677e32207b8';

-- Create mutual challenges to trigger matches immediately
-- Match 1: Yosri ↔ David Johnson
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('de3fed90-cb12-4727-98ce-4677e32207b8', '550e8400-e29b-41d4-a716-446655440002', 'challenge', NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440002', 'de3fed90-cb12-4727-98ce-4677e32207b8', 'challenge', NOW() - INTERVAL '1 hour' + INTERVAL '2 minutes');

-- Match 2: Yosri ↔ Marcus Williams  
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('de3fed90-cb12-4727-98ce-4677e32207b8', '550e8400-e29b-41d4-a716-446655440004', 'challenge', NOW() - INTERVAL '30 minutes'),
('550e8400-e29b-41d4-a716-446655440004', 'de3fed90-cb12-4727-98ce-4677e32207b8', 'challenge', NOW() - INTERVAL '30 minutes' + INTERVAL '3 minutes');

-- Match 3: Yosri ↔ Alex Rodriguez
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('de3fed90-cb12-4727-98ce-4677e32207b8', '550e8400-e29b-41d4-a716-446655440006', 'challenge', NOW() - INTERVAL '15 minutes'),
('550e8400-e29b-41d4-a716-446655440006', 'de3fed90-cb12-4727-98ce-4677e32207b8', 'challenge', NOW() - INTERVAL '15 minutes' + INTERVAL '1 minute');

-- Verify matches were created
SELECT 
    m.id as match_id,
    m.created_at,
    CASE 
        WHEN m.user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8' THEN p.full_name 
        ELSE p2.full_name 
    END as matched_user_name
FROM matches m
LEFT JOIN profiles p ON p.id = m.user_b AND m.user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8'
LEFT JOIN profiles p2 ON p2.id = m.user_a AND m.user_b = 'de3fed90-cb12-4727-98ce-4677e32207b8'
WHERE m.user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8' OR m.user_b = 'de3fed90-cb12-4727-98ce-4677e32207b8'
ORDER BY m.created_at DESC;
