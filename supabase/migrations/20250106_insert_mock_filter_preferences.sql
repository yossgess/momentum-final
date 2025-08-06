-- Insert mock filter preferences for each mock profile
-- These preferences represent realistic user filter choices based on their profiles

INSERT INTO filter_preferences (
  user_id,
  interested_in,
  age_min,
  age_max,
  sports,
  distance_km,
  created_at,
  updated_at
) VALUES 

-- Sofia (Woman, 26, interested in men) - Prefers men 24-32, her sports, 30km radius
(
  '550e8400-e29b-41d4-a716-446655440001',
  'men',
  24,
  32,
  ARRAY['Padel', 'Tennis', 'Swimming'],
  30,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '1 day'
),

-- David (Man, 30, interested in women) - Prefers women 25-35, fitness sports, 25km radius
(
  '550e8400-e29b-41d4-a716-446655440002',
  'women',
  25,
  35,
  ARRAY['Running', 'Crossfit', 'Basketball'],
  25,
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '2 hours'
),

-- Emma (Woman, 24, interested in any) - Open to any gender 22-28, water/group sports, 40km radius
(
  '550e8400-e29b-41d4-a716-446655440003',
  'any',
  22,
  28,
  ARRAY['Swimming', 'Volleyball'],
  40,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '3 hours'
),

-- Marcus (Man, 28, interested in women) - Prefers women 24-32, strength sports, 35km radius
(
  '550e8400-e29b-41d4-a716-446655440004',
  'women',
  24,
  32,
  ARRAY['Football', 'Crossfit', 'Boxing'],
  35,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '4 hours'
),

-- Aria (Woman, 22, interested in men) - Prefers men 20-28, wellness sports, 20km radius
(
  '550e8400-e29b-41d4-a716-446655440005',
  'men',
  20,
  28,
  ARRAY['Fitness', 'Pilate', 'Yoga'],
  20,
  NOW() - INTERVAL '4 days',
  NOW() - INTERVAL '6 hours'
),

-- Alex (Man, 25, interested in any) - Open to any gender 23-30, racket sports, 50km radius
(
  '550e8400-e29b-41d4-a716-446655440006',
  'any',
  23,
  30,
  ARRAY['Tennis', 'Badminton', 'Swimming'],
  50,
  NOW() - INTERVAL '6 days',
  NOW() - INTERVAL '8 hours'
),

-- Maya (Woman, 27, interested in women) - Prefers women 25-32, team sports, 25km radius
(
  '550e8400-e29b-41d4-a716-446655440007',
  'women',
  25,
  32,
  ARRAY['Volleyball', 'Basketball'],
  25,
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '12 hours'
),

-- Jake (Man, 29, interested in men) - Prefers men 26-35, strength sports, 30km radius
(
  '550e8400-e29b-41d4-a716-446655440008',
  'men',
  26,
  35,
  ARRAY['Boxing', 'Crossfit', 'Running'],
  30,
  NOW() - INTERVAL '8 days',
  NOW() - INTERVAL '1 day'
)

ON CONFLICT (user_id) DO UPDATE SET
  interested_in = EXCLUDED.interested_in,
  age_min = EXCLUDED.age_min,
  age_max = EXCLUDED.age_max,
  sports = EXCLUDED.sports,
  distance_km = EXCLUDED.distance_km,
  updated_at = EXCLUDED.updated_at;

-- Add comment for documentation
COMMENT ON TABLE filter_preferences IS 'Mock filter preferences data for testing discovery filtering functionality';
