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
