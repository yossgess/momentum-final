-- Check if user-avatars bucket exists and create if missing
DO $$
BEGIN
  -- Check if bucket exists
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'user-avatars'
  ) THEN
    -- Create the bucket if it doesn't exist
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'user-avatars',
      'user-avatars',
      true,
      5242880, -- 5MB limit per file
      ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
    );
    
    RAISE NOTICE 'Created user-avatars bucket';
  ELSE
    RAISE NOTICE 'user-avatars bucket already exists';
  END IF;
END $$;

-- Verify bucket creation
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE id = 'user-avatars';

-- Check existing RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%avatar%';

-- List any existing files in the bucket
SELECT 
  name,
  bucket_id,
  owner,
  created_at,
  updated_at,
  last_accessed_at,
  metadata
FROM storage.objects 
WHERE bucket_id = 'user-avatars'
ORDER BY created_at DESC
LIMIT 10;
