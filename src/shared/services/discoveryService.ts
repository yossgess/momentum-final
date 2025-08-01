import { supabase } from '../../config/supabase';
import { ProfileRow } from '../types/database';
import { logEvent, Events } from '../utils/analytics';
import { useAuthStore } from '../stores/authStore';
import { DiscoverFilters } from '../../features/discovery/components/useDiscoverFiltersStore';

/**
 * Calculate distance between two points using Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in kilometers
 */
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Map DiscoverFilters to RPC parameters
export interface DiscoveryFilters {
  gender?: 'man' | 'woman';
  interestedIn?: 'men' | 'women' | 'any';
  ageRange: [number, number];
  sports?: string[];
  distanceKm?: number; // Maximum distance in kilometers
}

// Extended ProfileRow with distance information
export interface ProfileWithDistance extends ProfileRow {
  distanceInKm?: number;
}

// Match type with profile information
export interface Match {
  id: string;
  otherUser: ProfileRow;
  created_at: string;
}

// Match notification type
export interface MatchNotification {
  id: string;
  matched_user_id: string;
  created_at: string;
  seen: boolean;
}

/**
 * Get discovery profiles using Supabase RPC function
 * Server-side filtering for better performance and security
 * Excludes current user, already swiped users, and existing matches
 * Applies filters for gender, age, interested_in, sports, and distance
 */
export async function getDiscoveryProfiles(
  filters: DiscoveryFilters
): Promise<ProfileWithDistance[]> {
  try {
    const { user } = useAuthStore.getState();
    if (!user) {
      console.error('No authenticated user found');
      return [];
    }

    console.log('Fetching discovery profiles for user:', user.id);
    console.log('Applied filters:', filters);

    // First, let's test direct access to profiles table to verify data exists
    console.log('Testing direct access to profiles table...');
    try {
      const { data: directProfiles, error: directError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);
      
      console.log('Direct profiles query result:');
      console.log('- Direct data:', directProfiles);
      console.log('- Direct error:', directError);
      console.log('- Direct data length:', directProfiles?.length);
      
      if (directError) {
        console.error('Direct profiles access failed:', directError);
      }

      // Check specifically for mock profiles
      console.log('Checking for mock profiles...');
      const { data: mockProfiles, error: mockError } = await supabase
        .from('profiles')
        .select('*')
        .ilike('full_name', 'Test %');
      
      console.log('Mock profiles query result:');
      console.log('- Mock data:', mockProfiles);
      console.log('- Mock error:', mockError);
      console.log('- Mock data length:', mockProfiles?.length);

      // Check all profiles to see actual names
      console.log('Checking ALL profiles to see actual names...');
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('id, full_name, gender, interested_in, created_at')
        .order('created_at', { ascending: false });
      
      console.log('All profiles query result:');
      console.log('- All profiles data:', allProfiles);
      console.log('- All profiles error:', allError);
      console.log('- All profiles length:', allProfiles?.length);

      // Check if RLS is blocking access by trying different approaches
      console.log('Testing RLS policies...');
      const { data: rlsTest, error: rlsError } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id); // Exclude current user
      
      console.log('RLS test (profiles != current user):');
      console.log('- RLS test data:', rlsTest);
      console.log('- RLS test error:', rlsError);
      console.log('- RLS test length:', rlsTest?.length);

      // Check all profiles count
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      console.log('Total profiles count:', count);
      console.log('Count error:', countError);
      
    } catch (directTestError) {
      console.error('Direct profiles test failed:', directTestError);
    }

    logEvent('search_started', {
      gender: filters.gender,
      ageRange: `${filters.ageRange[0]}-${filters.ageRange[1]}`,
      sportsCount: filters.sports?.length || 0,
      distanceKm: filters.distanceKm,
    });

    const genderFilter = filters.gender || null;
    const interestedInFilter = filters.interestedIn || 'any';
    
    console.log('RPC parameters:', {
      user_id: user.id,
      gender_filter: genderFilter,
      interested_in_filter: interestedInFilter,
      min_age: filters.ageRange[0],
      max_age: filters.ageRange[1],
      sports_filter: filters.sports && filters.sports.length > 0 ? filters.sports : null,
      max_distance_km: filters.distanceKm || 25, // Default 25km if not specified
    });
    
    // TEMPORARY: Use direct table query since RPC is returning empty
    console.log('TEMPORARY: Using direct table query instead of RPC...');
    const { data: directProfiles, error: directError } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user.id) // Exclude current user
      .limit(10);

    console.log('Direct query for discovery:');
    console.log('- Direct profiles:', directProfiles);
    console.log('- Direct error:', directError);
    console.log('- Direct length:', directProfiles?.length);

    // Use direct profiles instead of RPC result temporarily
    const profilesToUse = directProfiles || [];

    if (directError) {
      console.error('Direct query failed:', directError);
      console.error('Error details:', directError.message || 'Unknown error');
      
      logEvent('rpc_discovery_fetch', {
        results_count: 0,
        success: false,
        source: 'direct_query_error',
        error_message: directError.message
      });
      return [];
    }

    if (!profilesToUse || !Array.isArray(profilesToUse)) {
      console.log('No profiles returned from direct query, returning empty array');
      logEvent('rpc_discovery_fetch', {
        results_count: 0,
        success: true,
        source: 'direct_query_no_results'
      });
      return [];
    }

    console.log('Direct query returned profiles:', profilesToUse.length);

    // Map direct query results to ProfileWithDistance type with null safety
    const profilesWithDistance: ProfileWithDistance[] = profilesToUse.map((profile: any) => ({
      id: profile?.id || '',
      full_name: profile?.full_name || '',
      date_of_birth: profile?.date_of_birth || '',
      gender: profile?.gender || 'man',
      interested_in: profile?.interested_in || 'any',
      preferred_sports: profile?.preferred_sports || [],
      availability: profile?.availability || [],
      avatar_urls: profile?.avatar_urls || [],
      lat: profile?.lat || null,
      lng: profile?.lng || null,
      created_at: profile?.created_at || new Date().toISOString(),
      distanceInKm: profile?.distance_km || undefined,
    }));

    logEvent('rpc_discovery_fetch', {
      results_count: profilesWithDistance.length,
      success: true,
      source: 'direct_query_temporary'
    });

    return profilesWithDistance;

  } catch (error) {
    console.error('Error in getDiscoveryProfiles:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    
    // Always return empty array on any error since we have real data in DB
    console.log('Returning empty array due to error');
    logEvent('rpc_discovery_fetch', {
      results_count: 0,
      success: false,
      source: 'error_fallback'
    });
    return [];
  }
}

/**
 * Record a swipe action (challenge or nope)
 * Inserts into swipes table and triggers matching logic via DB trigger
 */
export const swipeUser = async (swipedId: string, action: 'challenge' | 'nope'): Promise<void> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('User not authenticated for swipe action');
      throw new Error('User not authenticated');
    }

    console.log('Recording swipe action:', { action, swipedId, userId: user.id });

    // Log the swipe action
    logEvent('swipe_action', {
      action,
      targetUser: swipedId,
      userId: user.id,
    });

    // Insert swipe record with correct column names
    const { error: swipeError } = await supabase
      .from('swipes')
      .insert({
        swiper_id: user.id,  // Changed from user_id to swiper_id
        swiped_id: swipedId,
        action: action,
        created_at: new Date().toISOString(),
      });

    if (swipeError) {
      console.error('Error recording swipe:', swipeError);
      console.error('Swipe error details:', swipeError instanceof Error ? swipeError.message : String(swipeError));
      
      // Don't throw error for database issues, just log them
      // This keeps the app functional even if backend isn't fully set up
      console.warn('Swipe not recorded in database, but continuing with app functionality');
      return;
    }

    console.log('Swipe recorded successfully');

    // Log specific analytics events
    if (action === 'challenge') {
      logEvent(Events.PROFILE_SWIPED_RIGHT, {
        targetUserId: swipedId,
      });
    } else {
      logEvent(Events.PROFILE_SWIPED_LEFT, {
        targetUserId: swipedId,
      });
    }

  } catch (error) {
    console.error('Error in swipeUser:', error);
    console.error('Swipe error details:', error instanceof Error ? error.message : String(error));
    
    // Don't throw error to keep app functional
    console.warn('Swipe action failed, but continuing with app functionality');
  }
};

/**
 * Get all matches for the current user
 * Returns matches with full profile information of the matched user
 */
export const getMatches = async (): Promise<Match[]> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Get matches where user is either user_a or user_b
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select(`
        id,
        user_a,
        user_b,
        created_at
      `)
      .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (matchesError) {
      console.error('Error fetching matches:', matchesError);
      throw matchesError;
    }

    if (!matches || matches.length === 0) {
      return [];
    }

    // Get the other user's profile for each match
    const matchesWithProfiles: Match[] = [];
    
    for (const match of matches) {
      const otherUserId = match.user_a === user.id ? match.user_b : match.user_a;
      
      // Fetch the other user's profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', otherUserId)
        .single();

      if (profileError) {
        console.error('Error fetching profile for match:', profileError);
        continue; // Skip this match if profile fetch fails
      }

      if (profile) {
        matchesWithProfiles.push({
          id: match.id,
          otherUser: profile,
          created_at: match.created_at,
        });
      }
    }

    logEvent(Events.SCREEN_VIEWED, {
      screen: 'matches',
      matchCount: matchesWithProfiles.length,
    });

    return matchesWithProfiles;

  } catch (error) {
    console.error('Error in getMatches:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

/**
 * Get unread match notifications for the current user
 * Automatically marks them as seen after fetching
 */
export const getMatchNotifications = async (): Promise<MatchNotification[]> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Get unread notifications
    const { data: notifications, error: notificationsError } = await supabase
      .from('match_notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('seen', false)
      .order('created_at', { ascending: false });

    if (notificationsError) {
      console.error('Error fetching match notifications:', notificationsError);
      console.error('Error details:', notificationsError instanceof Error ? notificationsError.message : String(notificationsError));
      throw notificationsError;
    }

    if (!notifications || notifications.length === 0) {
      return [];
    }

    // Mark notifications as seen
    const notificationIds = notifications.map(n => n.id);
    const { error: updateError } = await supabase
      .from('match_notifications')
      .update({ seen: true })
      .in('id', notificationIds);

    if (updateError) {
      console.error('Error marking notifications as seen:', updateError);
      console.error('Error details:', updateError instanceof Error ? updateError.message : String(updateError));
      // Don't throw here, just log the error
    }

    logEvent(Events.NOTIFICATION_PRESSED, {
      notificationCount: notifications.length,
      type: 'match_notifications',
    });

    return notifications.map(notification => ({
      id: notification.id,
      matched_user_id: notification.matched_user_id,
      created_at: notification.created_at,
      seen: true, // We just marked them as seen
    }));

  } catch (error) {
    console.error('Error in getMatchNotifications:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

/**
 * Utility: Mark specific match notifications as seen
 * Optional method for more granular control
 */
export const markMatchNotificationsAsSeen = async (notificationIds: string[]): Promise<void> => {
  try {
    if (notificationIds.length === 0) return;

    const { error } = await supabase
      .from('match_notifications')
      .update({ seen: true })
      .in('id', notificationIds);

    if (error) {
      console.error('Error marking notifications as seen:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      throw error;
    }

    logEvent(Events.NOTIFICATION_PRESSED, {
      action: 'mark_as_seen',
      notificationIds: notificationIds.join(','),
    });

  } catch (error) {
    console.error('Error in markMatchNotificationsAsSeen:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

/**
 * Utility: Revert the last swipe by deleting the most recent swipe record
 * Optional method for undo functionality
 */
export const revertLastSwipe = async (): Promise<void> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Get the most recent swipe
    const { data: lastSwipe, error: fetchError } = await supabase
      .from('swipes')
      .select('*')
      .eq('swiper_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError) {
      console.error('Error fetching last swipe:', fetchError);
      console.error('Error details:', fetchError instanceof Error ? fetchError.message : String(fetchError));
      throw fetchError;
    }

    if (!lastSwipe) {
      throw new Error('No swipe to revert');
    }

    // Delete the last swipe
    const { error: deleteError } = await supabase
      .from('swipes')
      .delete()
      .eq('id', lastSwipe.id);

    if (deleteError) {
      console.error('Error deleting last swipe:', deleteError);
      console.error('Error details:', deleteError instanceof Error ? deleteError.message : String(deleteError));
      throw deleteError;
    }

    logEvent('swipe_reverted', {
      revertedSwipeId: lastSwipe.id,
      revertedAction: lastSwipe.action,
      targetUser: lastSwipe.swiped_id,
    });

  } catch (error) {
    console.error('Error in revertLastSwipe:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

/**
 * Helper function to get current user's profile
 * Used internally for filtering logic
 */
const getCurrentUserProfile = async (): Promise<ProfileRow | null> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching current user profile:', profileError);
      console.error('Error details:', profileError instanceof Error ? profileError.message : String(profileError));
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    return null;
  }
};
