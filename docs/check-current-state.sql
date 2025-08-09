-- Check Current State of Matches and Notifications
-- This will show us exactly what exists right now

-- 1. Show all matches for Yosri
SELECT 
    m.id as match_id,
    m.created_at as match_created,
    m.user_a,
    m.user_b,
    p.full_name as matched_user_name
FROM matches m
LEFT JOIN profiles p ON p.id = CASE 
    WHEN m.user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8' THEN m.user_b 
    ELSE m.user_a 
END
WHERE m.user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8' OR m.user_b = 'de3fed90-cb12-4727-98ce-4677e32207b8'
ORDER BY m.created_at DESC;

-- 2. Show all match notifications for Yosri
SELECT 
    mn.id,
    mn.user_id,
    mn.matched_user_id,
    mn.created_at,
    mn.seen,
    p.full_name as matched_user_name
FROM match_notifications mn
LEFT JOIN profiles p ON p.id = mn.matched_user_id
WHERE mn.user_id = 'de3fed90-cb12-4727-98ce-4677e32207b8'
ORDER BY mn.created_at DESC;

-- 3. Show all swipes involving Yosri
SELECT 
    s.id,
    s.swiper_id,
    s.swiped_id,
    s.action,
    s.created_at,
    p1.full_name as swiper_name,
    p2.full_name as swiped_name
FROM swipes s
LEFT JOIN profiles p1 ON p1.id = s.swiper_id
LEFT JOIN profiles p2 ON p2.id = s.swiped_id
WHERE s.swiper_id = 'de3fed90-cb12-4727-98ce-4677e32207b8' 
   OR s.swiped_id = 'de3fed90-cb12-4727-98ce-4677e32207b8'
ORDER BY s.created_at DESC;

-- 4. Test the get_user_matches RPC function
SELECT * FROM get_user_matches('de3fed90-cb12-4727-98ce-4677e32207b8');
