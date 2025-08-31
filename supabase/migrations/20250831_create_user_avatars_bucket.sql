-- Create storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-avatars',
  'user-avatars',
  true,
  5242880, -- 5MB limit per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
);

-- Create RLS policies for user-avatars bucket
CREATE POLICY "Users can upload their own avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'user-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'user-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'user-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'user-avatars');

-- Optional: Create a function to clean up orphaned photos
CREATE OR REPLACE FUNCTION cleanup_orphaned_avatars()
RETURNS void AS $$
BEGIN
  -- Delete storage objects where the user no longer exists
  DELETE FROM storage.objects 
  WHERE bucket_id = 'user-avatars'
  AND (storage.foldername(name))[1] NOT IN (
    SELECT id::text FROM auth.users
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Create a function to get user's avatar count
CREATE OR REPLACE FUNCTION get_user_avatar_count(user_id uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM storage.objects
    WHERE bucket_id = 'user-avatars'
    AND (storage.foldername(name))[1] = user_id::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
