# Supabase Database Setup

This document contains the SQL commands needed to set up the Supabase database for the Momentum app.

## 1. Create profiles table

```sql
-- Create profiles table
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  date_of_birth date,
  gender text check (gender in ('man', 'woman')),
  interested_in text check (interested_in in ('men', 'women', 'any')),
  preferred_sports text[],
  availability jsonb,
  avatar_urls text[],
  created_at timestamp default now()
);
```

## 2. Enable Row-Level Security (RLS)

```sql
-- Enable RLS on profiles table
alter table profiles enable row level security;

-- Create RLS policy
create policy "Users can manage their own profile"
on profiles
for all
using (auth.uid() = id);
```

## 3. Create Storage Bucket

```sql
-- Create storage bucket for user avatars
insert into storage.buckets (id, name, public) 
values ('user-avatars', 'user-avatars', true);

-- Create storage policy for uploads
create policy "Users can upload their own avatars"
on storage.objects
for insert
with check (bucket_id = 'user-avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policy for viewing
create policy "Users can view their own avatars"
on storage.objects
for select
using (bucket_id = 'user-avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policy for updates
create policy "Users can update their own avatars"
on storage.objects
for update
using (bucket_id = 'user-avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policy for deletes
create policy "Users can delete their own avatars"
on storage.objects
for delete
using (bucket_id = 'user-avatars' and auth.uid()::text = (storage.foldername(name))[1]);
```

## 4. OAuth Provider Configuration

In the Supabase Dashboard, configure the following OAuth providers:

### Google OAuth
- **Redirect URLs**: 
  - Development: `exp://127.0.0.1:8081`
  - Production: `your-app-scheme://`

### Facebook OAuth
- **Redirect URLs**: 
  - Development: `exp://127.0.0.1:8081`
  - Production: `your-app-scheme://`

## 5. Email Settings

Configure email templates and settings in the Supabase Dashboard:
- Enable email confirmations
- Set up password reset emails
- Configure email templates

## 6. Test Data (Optional)

```sql
-- Insert test profile (replace with actual user ID)
insert into profiles (id, full_name, gender, interested_in, preferred_sports, availability)
values (
  'your-test-user-id',
  'Test User',
  'man',
  'women',
  array['Tennis', 'Football'],
  '{"days": ["Monday", "Wednesday"], "periods": ["Morning", "Evening"]}'::jsonb
);
```

## 7. Discovery RPC Functions

### Batch-enabled Discovery Profiles Function

```sql
-- Create RPC function for batch discovery profile fetching
-- Supports LIMIT and OFFSET for efficient pagination
create or replace function get_discovery_profiles_batch(
  user_id uuid,
  limit_count integer default 10,
  offset_count integer default 0
)
returns table (
  id uuid,
  full_name text,
  date_of_birth date,
  gender text,
  interested_in text,
  preferred_sports text[],
  availability jsonb,
  avatar_urls text[],
  created_at timestamp,
  lat double precision,
  lng double precision,
  distance_km double precision,
  user_sports text[],
  common_sports text[]
)
language plpgsql
security definer
as $$
declare
  user_lat double precision;
  user_lng double precision;
  user_gender text;
  user_interested_in text;
  user_sports text[];
  user_age integer;
  filter_interested_in text;
  filter_min_age integer;
  filter_max_age integer;
  filter_sports text[];
  filter_distance_km double precision;
begin
  -- Get current user's profile data
  select p.lat, p.lng, p.gender, p.interested_in, p.preferred_sports,
         extract(year from age(current_date, p.date_of_birth))::integer
  into user_lat, user_lng, user_gender, user_interested_in, user_sports, user_age
  from profiles p
  where p.id = user_id;

  -- Get user's filter preferences (with defaults)
  select coalesce(fp.interested_in, 'any'),
         coalesce(fp.min_age, 18),
         coalesce(fp.max_age, 65),
         coalesce(fp.sports, array[]::text[]),
         coalesce(fp.distance_km, 25)
  into filter_interested_in, filter_min_age, filter_max_age, filter_sports, filter_distance_km
  from filter_preferences fp
  where fp.user_id = user_id;

  -- Return filtered profiles with pagination
  return query
  select 
    p.id,
    p.full_name,
    p.date_of_birth,
    p.gender,
    p.interested_in,
    p.preferred_sports,
    p.availability,
    p.avatar_urls,
    p.created_at,
    p.lat,
    p.lng,
    -- Calculate distance using Haversine formula
    case 
      when p.lat is not null and p.lng is not null and user_lat is not null and user_lng is not null then
        6371 * acos(
          cos(radians(user_lat)) * cos(radians(p.lat)) * 
          cos(radians(p.lng) - radians(user_lng)) + 
          sin(radians(user_lat)) * sin(radians(p.lat))
        )
      else null
    end as distance_km,
    p.preferred_sports as user_sports,
    -- Calculate common sports
    case 
      when user_sports is not null and p.preferred_sports is not null then
        array(select unnest(user_sports) intersect select unnest(p.preferred_sports))
      else array[]::text[]
    end as common_sports
  from profiles p
  where 
    -- Exclude self
    p.id != user_id
    
    -- Age filter
    and extract(year from age(current_date, p.date_of_birth))::integer between filter_min_age and filter_max_age
    
    -- Mutual compatibility filter
    and (
      -- User interested in this profile's gender
      (filter_interested_in = 'any' or 
       (filter_interested_in = 'men' and p.gender = 'man') or 
       (filter_interested_in = 'women' and p.gender = 'woman'))
      and
      -- This profile interested in user's gender  
      (p.interested_in = 'any' or 
       (p.interested_in = 'men' and user_gender = 'man') or 
       (p.interested_in = 'women' and user_gender = 'woman'))
    )
    
    -- Sports filter (if specified)
    and (
      array_length(filter_sports, 1) is null or
      p.preferred_sports && filter_sports
    )
    
    -- Distance filter (if both users have location)
    and (
      user_lat is null or user_lng is null or p.lat is null or p.lng is null or
      6371 * acos(
        cos(radians(user_lat)) * cos(radians(p.lat)) * 
        cos(radians(p.lng) - radians(user_lng)) + 
        sin(radians(user_lat)) * sin(radians(p.lat))
      ) <= filter_distance_km
    )
    
  order by 
    -- Prioritize profiles with common sports
    array_length(
      case 
        when user_sports is not null and p.preferred_sports is not null then
          array(select unnest(user_sports) intersect select unnest(p.preferred_sports))
        else array[]::text[]
      end, 1
    ) desc nulls last,
    -- Then by distance (closest first)
    case 
      when p.lat is not null and p.lng is not null and user_lat is not null and user_lng is not null then
        6371 * acos(
          cos(radians(user_lat)) * cos(radians(p.lat)) * 
          cos(radians(p.lng) - radians(user_lng)) + 
          sin(radians(user_lat)) * sin(radians(p.lat))
        )
      else 999999
    end asc,
    -- Finally by creation date (newest first)
    p.created_at desc
    
  limit limit_count
  offset offset_count;
end;
$$;
```
