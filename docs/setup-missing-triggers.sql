-- Setup Missing Database Triggers for Match Functionality
-- This script creates the triggers that should automatically create matches and notifications

-- 1. Create the handle_mutual_challenge function
CREATE OR REPLACE FUNCTION handle_mutual_challenge()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is a challenge action
  IF NEW.action = 'challenge' THEN
    -- Check if there's a mutual challenge (other user already challenged back)
    IF EXISTS (
      SELECT 1 FROM swipes 
      WHERE swiper_id = NEW.swiped_id 
        AND swiped_id = NEW.swiper_id 
        AND action = 'challenge'
    ) THEN
      -- Create a match if one doesn't already exist
      INSERT INTO matches (user_a, user_b, created_at)
      VALUES (
        LEAST(NEW.swiper_id, NEW.swiped_id),
        GREATEST(NEW.swiper_id, NEW.swiped_id),
        NOW()
      )
      ON CONFLICT (user_a, user_b) DO NOTHING;
      
      -- Log that a match was created
      RAISE NOTICE 'Match created between % and %', NEW.swiper_id, NEW.swiped_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create trigger on swipes table
DROP TRIGGER IF EXISTS trigger_handle_mutual_challenge ON swipes;
CREATE TRIGGER trigger_handle_mutual_challenge
  AFTER INSERT ON swipes
  FOR EACH ROW
  EXECUTE FUNCTION handle_mutual_challenge();

-- 3. Create the create_match_notifications function
CREATE OR REPLACE FUNCTION create_match_notifications()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notifications for both users when a match is created
  INSERT INTO match_notifications (user_id, matched_user_id, match_id, created_at, seen)
  VALUES 
    (NEW.user_a, NEW.user_b, NEW.id, NOW(), false),
    (NEW.user_b, NEW.user_a, NEW.id, NOW(), false);
  
  -- Log that notifications were created
  RAISE NOTICE 'Match notifications created for match %', NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger on matches table
DROP TRIGGER IF EXISTS trigger_create_match_notifications ON matches;
CREATE TRIGGER trigger_create_match_notifications
  AFTER INSERT ON matches
  FOR EACH ROW
  EXECUTE FUNCTION create_match_notifications();

-- 5. Test the triggers with the existing mutual challenges
-- Delete any existing matches first
DELETE FROM match_notifications WHERE user_id = 'de3fed90-cb12-4727-98ce-4677e32207b8';
DELETE FROM matches WHERE user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8' OR user_b = 'de3fed90-cb12-4727-98ce-4677e32207b8';

-- Re-insert one of the mutual challenges to trigger the match creation
-- This should now create a match because both challenges already exist
INSERT INTO swipes (swiper_id, swiped_id, action, created_at) VALUES
('de3fed90-cb12-4727-98ce-4677e32207b8', '550e8400-e29b-41d4-a716-446655440001', 'challenge', NOW());

-- Check if match was created by the trigger
SELECT 
    m.id as match_id,
    m.created_at,
    m.user_a,
    m.user_b,
    p.full_name as matched_user_name
FROM matches m
LEFT JOIN profiles p ON p.id = CASE 
    WHEN m.user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8' THEN m.user_b 
    ELSE m.user_a 
END
WHERE m.user_a = 'de3fed90-cb12-4727-98ce-4677e32207b8' OR m.user_b = 'de3fed90-cb12-4727-98ce-4677e32207b8';

-- Check if notifications were created
SELECT 
    mn.id,
    mn.user_id,
    mn.matched_user_id,
    mn.created_at,
    mn.seen,
    p.full_name as matched_user_name
FROM match_notifications mn
LEFT JOIN profiles p ON p.id = mn.matched_user_id
WHERE mn.user_id = 'de3fed90-cb12-4727-98ce-4677e32207b8';

-- Expected Results:
-- Should show 1 match created between Yosri and Sofia
-- Should show 1 match notification for Yosri
-- Console should show NOTICE messages about match and notifications being created
