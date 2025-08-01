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

    logEvent('search_started', {
      gender: filters.gender,
      ageRange: `${filters.ageRange[0]}-${filters.ageRange[1]}`,
      sportsCount: filters.sports?.length || 0,
      distanceKm: filters.distanceKm,
      method: 'server_side_attempt',
    });

    const genderFilter = filters.gender || null;
    const interestedInFilter = filters.interestedIn || 'any';
    
    // Call Supabase RPC function for server-side filtering
    console.log('Calling RPC function get_discovery_profiles...');
    
    // Back to production RPC function - minimal debug confirmed basic functionality works
    const { data: profiles, error } = await supabase.rpc('get_discovery_profiles', {
      user_id: user.id,
      gender_filter: genderFilter,
      interested_in_filter: interestedInFilter,
      min_age: filters.ageRange[0],
      max_age: filters.ageRange[1],
      sports_filter: filters.sports && filters.sports.length > 0 ? filters.sports : null,
      max_distance_km: filters.distanceKm || 25,
    });

    console.log(' PRODUCTION RPC Response:');
    console.log('- Error:', error);
    console.log('- Profiles count:', profiles?.length);
    if (profiles && profiles.length > 0) {
      console.log('- First 3 profiles:', profiles.slice(0, 3).map((p: any) => ({
        name: p.full_name,
        distance: p.distance_km?.toFixed(2) + 'km',
        gender: p.gender,
        interested_in: p.interested_in
      })));
    } else {
      console.log(' Production RPC returned 0 profiles - checking which filter is too restrictive');
      console.log('- Applied filters:', {
        gender_filter: genderFilter,
        interested_in_filter: interestedInFilter,
        min_age: filters.ageRange[0],
        max_age: filters.ageRange[1],
        sports_filter: filters.sports,
        max_distance_km: filters.distanceKm || 25
      });
    }

    if (error) {
      console.warn('RPC function failed, using client-side fallback:', error.message);
      logEvent('search_fallback_triggered', { 
        reason: 'rpc_error', 
        error: error.message 
      });
      
      return await getDiscoveryProfilesClientSide(filters);
    }

    if (!profiles || !Array.isArray(profiles)) {
      console.warn('RPC returned invalid data format, using client-side fallback');
      logEvent('search_fallback_triggered', { 
        reason: 'invalid_data_format',
        dataType: typeof profiles 
      });
      
      return await getDiscoveryProfilesClientSide(filters);
    }

    // Convert profiles to ProfileWithDistance format
    const profilesWithDistance: ProfileWithDistance[] = profiles.map((profile: any) => ({
      ...profile,
      distanceInKm: profile.distance_km || undefined, // Map server distance field
    }));

    console.log(` Server-side filtering successful: ${profilesWithDistance.length} profiles`);
    
    logEvent('search_results_loaded', {
      profileCount: profilesWithDistance.length,
      method: 'server_side',
      hasLocationData: profilesWithDistance.some(p => p.distanceInKm !== undefined),
    });

    return profilesWithDistance;

  } catch (error) {
    console.error('Unexpected error in getDiscoveryProfiles:', error);
    logEvent('search_fallback_triggered', { 
      reason: 'unexpected_error',
      error: error instanceof Error ? error.message : String(error)
    });
    
    // Fallback to client-side filtering on any error
    console.log(' Falling back to client-side filtering due to error...');
    return await getDiscoveryProfilesClientSide(filters);
  }
}

/**
 * Client-side fallback for discovery profiles with location filtering
 * Used when server-side RPC is not available or fails
 */
async function getDiscoveryProfilesClientSide(
  filters: DiscoveryFilters
): Promise<ProfileWithDistance[]> {
  try {
    console.log('Starting client-side profile filtering...');
    
    // Get current user's profile for location-based filtering
    const currentUserProfile = await getCurrentUserProfile();
    if (!currentUserProfile) {
      console.error('Could not get current user profile for location filtering');
      return [];
    }

    // Get all profiles except current user
    const { data: allProfiles, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', currentUserProfile.id);

    if (error) {
      console.error('Error fetching profiles for client-side filtering:', error);
      throw error;
    }

    if (!allProfiles) {
      console.log('No profiles found');
      return [];
    }

    console.log(`Filtering ${allProfiles.length} profiles client-side...`);

    // Apply client-side filters
    let filteredProfiles = allProfiles.filter((profile: ProfileRow) => {
      // Gender filter
      if (filters.gender && profile.gender !== filters.gender) {
        return false;
      }

      // Interested in filter
      if (filters.interestedIn && filters.interestedIn !== 'any') {
        if (filters.interestedIn === 'men' && profile.gender !== 'man') return false;
        if (filters.interestedIn === 'women' && profile.gender !== 'woman') return false;
      }

      // Age filter
      if (profile.date_of_birth) {
        const age = new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear();
        if (age < filters.ageRange[0] || age > filters.ageRange[1]) {
          return false;
        }
      }

      // Sports filter
      if (filters.sports && filters.sports.length > 0) {
        const profileSports = profile.preferred_sports || [];
        const hasMatchingSport = filters.sports.some(sport => 
          profileSports.includes(sport)
        );
        if (!hasMatchingSport) {
          return false;
        }
      }

      return true;
    });

    // Apply distance filter if both users have location data
    const profilesWithDistance: ProfileWithDistance[] = filteredProfiles.map((profile: ProfileRow) => {
      let distanceInKm: number | undefined;

      if (currentUserProfile.lat && currentUserProfile.lng && 
          profile.lat && profile.lng) {
        distanceInKm = haversineDistance(
          currentUserProfile.lat,
          currentUserProfile.lng,
          profile.lat,
          profile.lng
        );
      }

      return {
        ...profile,
        distanceInKm,
      };
    });

    // Filter by distance if specified
    if (filters.distanceKm) {
      filteredProfiles = profilesWithDistance.filter(profile => {
        if (profile.distanceInKm === undefined) {
          // Include profiles without location data (they might be new users)
          return true;
        }
        return profile.distanceInKm <= filters.distanceKm!;
      });
    } else {
      filteredProfiles = profilesWithDistance;
    }

    console.log(`Client-side filtering complete: ${filteredProfiles.length} profiles remaining`);
    
    logEvent('search_results_loaded', {
      profileCount: filteredProfiles.length,
      method: 'client_side',
      hasLocationData: filteredProfiles.some(p => p.distanceInKm !== undefined),
    });

    return filteredProfiles;

  } catch (error) {
    console.error('Error in client-side profile filtering:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    throw error;
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
