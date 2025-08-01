-- Mock Data for Momentum Sports App
-- This script creates test data for profiles, swipes, matches, and notifications
-- Run this in your Supabase SQL Editor to populate the database with test data

-- First, let's clear any existing mock data (optional - uncomment if needed)
-- DELETE FROM match_notifications WHERE matched_user_id IN (SELECT id FROM profiles WHERE full_name LIKE 'Test %');
-- DELETE FROM matches WHERE user1_id IN (SELECT id FROM profiles WHERE full_name LIKE 'Test %') OR user2_id IN (SELECT id FROM profiles WHERE full_name LIKE 'Test %');
-- DELETE FROM swipes WHERE swiper_id IN (SELECT id FROM profiles WHERE full_name LIKE 'Test %') OR swiped_id IN (SELECT id FROM profiles WHERE full_name LIKE 'Test %');
-- DELETE FROM profiles WHERE full_name LIKE 'Test %';
-- DELETE FROM auth.users WHERE id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440008');

-- Insert test users first (required for foreign key constraint)
-- Note: In production, users are created via Supabase Auth, but for testing we'll create them directly
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'test.sofia@momentum.app', crypt('testpass123', gen_salt('bf')), NOW(), NOW(), NOW(), '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'test.david@momentum.app', crypt('testpass123', gen_salt('bf')), NOW(), NOW(), NOW(), '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'test.emma@momentum.app', crypt('testpass123', gen_salt('bf')), NOW(), NOW(), NOW(), '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'test.marcus@momentum.app', crypt('testpass123', gen_salt('bf')), NOW(), NOW(), NOW(), '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'test.aria@momentum.app', crypt('testpass123', gen_salt('bf')), NOW(), NOW(), NOW(), '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'test.alex@momentum.app', crypt('testpass123', gen_salt('bf')), NOW(), NOW(), NOW(), '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440007', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'test.maya@momentum.app', crypt('testpass123', gen_salt('bf')), NOW(), NOW(), NOW(), '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440008', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'test.jake@momentum.app', crypt('testpass123', gen_salt('bf')), NOW(), NOW(), NOW(), '', '', '', '')
ON CONFLICT (id) DO NOTHING; -- Avoid errors if users already exist

-- Insert mock profiles with diverse data for testing
INSERT INTO profiles (
  id,
  full_name,
  date_of_birth,
  gender,
  interested_in,
  preferred_sports,
  availability,
  avatar_urls,
  lat,
  lng,
  created_at
) VALUES 
-- Test Profile 1: Sofia (Woman, 26, interested in men)
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Test Sofia Martinez',
  '1998-03-15',
  'woman',
  'men',
  ARRAY['Padel', 'Yoga', 'Tennis', 'Swimming'],
  '["monday_morning", "tuesday_evening", "weekend_afternoon"]'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop'
  ],
  40.7589, -- NYC coordinates with slight variation
  -73.9851,
  NOW() - INTERVAL '5 days'
),

-- Test Profile 2: David (Man, 30, interested in women)
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Test David Johnson',
  '1994-07-22',
  'man',
  'women',
  ARRAY['Running', 'Crossfit', 'Basketball', 'Cycling'],
  '["monday_evening", "wednesday_morning", "weekend_morning"]'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop'
  ],
  40.7505,
  -73.9934,
  NOW() - INTERVAL '3 days'
),

-- Test Profile 3: Emma (Woman, 24, interested in any)
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Test Emma Thompson',
  '2000-11-08',
  'woman',
  'any',
  ARRAY['Swimming', 'Volleyball', 'Walking', 'Pilate'],
  '["tuesday_morning", "thursday_evening", "weekend_afternoon"]'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop'
  ],
  40.7614,
  -73.9776,
  NOW() - INTERVAL '1 day'
),

-- Test Profile 4: Marcus (Man, 28, interested in women)
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Test Marcus Williams',
  '1996-01-12',
  'man',
  'women',
  ARRAY['Football', 'Crossfit', 'Cycling', 'Boxing'],
  '["monday_afternoon", "wednesday_evening", "weekend_morning"]'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop'
  ],
  40.7282,
  -74.0776,
  NOW() - INTERVAL '2 days'
),

-- Test Profile 5: Aria (Woman, 22, interested in men)
(
  '550e8400-e29b-41d4-a716-446655440005',
  'Test Aria Chen',
  '2002-09-30',
  'woman',
  'men',
  ARRAY['Fitness', 'Pilate', 'Cycling', 'Yoga'],
  '["tuesday_afternoon", "friday_morning", "weekend_evening"]'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop'
  ],
  40.7831,
  -73.9712,
  NOW() - INTERVAL '4 days'
),

-- Test Profile 6: Alex (Man, 25, interested in any)
(
  '550e8400-e29b-41d4-a716-446655440006',
  'Test Alex Rodriguez',
  '1999-05-18',
  'man',
  'any',
  ARRAY['Tennis', 'Swimming', 'Running', 'Badminton'],
  '["monday_morning", "thursday_afternoon", "weekend_morning"]'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=600&fit=crop'
  ],
  40.7505,
  -73.9758,
  NOW() - INTERVAL '6 days'
),

-- Test Profile 7: Maya (Woman, 27, interested in women)
(
  '550e8400-e29b-41d4-a716-446655440007',
  'Test Maya Patel',
  '1997-12-03',
  'woman',
  'women',
  ARRAY['Volleyball', 'Basketball', 'Running', 'Fitness'],
  '["wednesday_morning", "friday_evening", "weekend_afternoon"]'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=600&fit=crop'
  ],
  40.7282,
  -73.9942,
  NOW() - INTERVAL '7 days'
),

-- Test Profile 8: Jake (Man, 29, interested in men)
(
  '550e8400-e29b-41d4-a716-446655440008',
  'Test Jake Anderson',
  '1995-04-25',
  'man',
  'men',
  ARRAY['Boxing', 'Crossfit', 'Running', 'Football'],
  '["tuesday_morning", "thursday_evening", "weekend_morning"]'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&h=600&fit=crop'
  ],
  40.7614,
  -73.9899,
  NOW() - INTERVAL '8 days'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  date_of_birth = EXCLUDED.date_of_birth,
  gender = EXCLUDED.gender,
  interested_in = EXCLUDED.interested_in,
  preferred_sports = EXCLUDED.preferred_sports,
  availability = EXCLUDED.availability,
  avatar_urls = EXCLUDED.avatar_urls,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng;

{{ ... }}
