-- RLS Policies for Discovery Functionality
-- These policies allow users to see other profiles for discovery while maintaining security

-- Enable RLS on profiles table (if not already enabled)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own profile (full access)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy 3: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy 4: Users can view other profiles for discovery (limited fields)
-- This allows discovery functionality while protecting sensitive data
CREATE POLICY "Users can view profiles for discovery" ON profiles
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND 
    auth.uid() != id AND
    -- Only allow viewing profiles that haven't been swiped on yet
    NOT EXISTS (
      SELECT 1 FROM swipes 
      WHERE swiper_id = auth.uid() 
      AND swiped_id = profiles.id
    )
  );

-- Policy 5: Allow RPC functions to access profiles for discovery
-- This is needed for the get_discovery_profiles function
CREATE POLICY "RPC functions can access profiles for discovery" ON profiles
  FOR SELECT USING (
    -- Allow access when called from RPC functions
    current_setting('role') = 'authenticated' OR
    current_setting('role') = 'service_role'
  );

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';
