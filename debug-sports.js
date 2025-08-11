// Debug script to test RPC function directly
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRPCFunction() {
  try {
    console.log('Testing RPC function directly...');
    
    // Test with Sofia's user ID from mock data
    const testUserId = '550e8400-e29b-41d4-a716-446655440001';
    
    const { data: profiles, error } = await supabase.rpc('get_discovery_profiles_batch', {
      user_id: testUserId,
      limit_count: 10,
      offset_count: 0
    });

    if (error) {
      console.error('RPC Error:', error);
      return;
    }

    console.log('RPC Success! Profiles returned:', profiles?.length || 0);
    
    if (profiles && profiles.length > 0) {
      console.log('First profile sample:', {
        id: profiles[0].id,
        full_name: profiles[0].full_name,
        user_sports: profiles[0].user_sports,
        common_sports: profiles[0].common_sports,
        distance_km: profiles[0].distance_km
      });
      
      // Check for sports data in all profiles
      const profilesWithSports = profiles.filter(p => 
        (p.user_sports && p.user_sports.length > 0) || 
        (p.common_sports && p.common_sports.length > 0)
      );
      
      console.log(`Profiles with sports data: ${profilesWithSports.length}/${profiles.length}`);
      
      profilesWithSports.forEach(profile => {
        console.log(`Profile ${profile.full_name}:`, {
          user_sports: profile.user_sports,
          common_sports: profile.common_sports
        });
      });
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testRPCFunction();
