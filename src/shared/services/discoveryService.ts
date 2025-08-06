import { supabase } from '../../config/supabase';
import { ProfileRow } from '../types/database';
import { logEvent, Events } from '../utils/analytics';
import { useAuthStore } from '../stores/authStore';
import { DiscoverFilters } from '../../features/discovery/components/useDiscoverFiltersStore';
import { getSportByName } from '../../constants/sports';
import { Sport } from '../types/sports';

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

/**
 * Transform sport names array to Sport objects
 * @param sportNames Array of sport names from database
 * @returns Array of Sport objects with icons and metadata
 */
function transformSportsToObjects(sportNames: string[]): Sport[] {
  if (!sportNames || sportNames.length === 0) {
    return [];
  }
  
  return sportNames
    .map(name => getSportByName(name))
    .filter((sport): sport is Sport => sport !== undefined);
}

// Aligned with both filter store and RPC function parameters
export interface DiscoveryFilters {
  interestedIn: 'men' | 'women' | 'any'; // What user is interested in (maps to interested_in_filter)
  ageRange: [number, number]; // Age range [min, max] (maps to min_age, max_age)
  sports: string[]; // Preferred sports (maps to sports_filter)
  distanceKm: number; // Maximum distance in km (maps to max_distance_km)
}

// Extended ProfileRow with distance information and sports data
export interface ProfileWithDistance extends ProfileRow {
  distanceInKm?: number;
  userSports?: string[];
  commonSports?: string[];
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
export async function getDiscoveryProfiles(): Promise<ProfileWithDistance[]> {
  const { user } = useAuthStore.getState();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    // First check if user has location data - required for discovery
    const { data: userProfile, error: locationError } = await supabase
      .from('profiles')
      .select('lat, lng')
      .eq('id', user.id)
      .single();

    if (locationError) {
      console.error('Failed to check user location:', locationError);
      throw new Error('Failed to verify user location');
    }

    if (!userProfile?.lat || !userProfile?.lng) {
      console.log('User location not found - blocking discovery');
      logEvent('discovery_blocked_no_location', {
        userId: user.id,
        hasLat: !!userProfile?.lat,
        hasLng: !!userProfile?.lng
      });
      throw new Error('LOCATION_REQUIRED');
    }

    console.log('Fetching discovery profiles using saved filter preferences for user:', user.id);

    logEvent('search_started', {
      method: 'filter_preferences_table',
      userId: user.id
    });

    // Always use the optimized RPC function that gets preferences from filter_preferences table
    const { data: profiles, error } = await supabase.rpc('get_discovery_profiles_optimized', {
      user_id: user.id
    });

    if (error) {
      console.error('RPC function failed:', error.message);
      logEvent('search_error', { 
        reason: 'rpc_error', 
        error: error.message,
        method: 'filter_preferences_table'
      });
      
      throw new Error(`Discovery RPC failed: ${error.message}`);
    }

    if (!profiles || !Array.isArray(profiles)) {
      console.error('RPC returned invalid data format:', typeof profiles);
      logEvent('search_error', { 
        reason: 'invalid_data_format',
        dataType: typeof profiles,
        method: 'filter_preferences_table'
      });
      
      throw new Error('Invalid data format from discovery RPC');
    }

    // Convert profiles to ProfileWithDistance format with sports data
    const profilesWithDistance: ProfileWithDistance[] = profiles.map((profile: any) => ({
      ...profile,
      distanceInKm: profile.distance_km || undefined, // Map server distance field
      userSports: profile.user_sports || [], // User's sports from filter_preferences
      commonSports: profile.common_sports || [], // Common sports with current user
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
    logEvent('search_error', { 
      reason: 'unexpected_error',
      error: error instanceof Error ? error.message : String(error)
    });
    
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
