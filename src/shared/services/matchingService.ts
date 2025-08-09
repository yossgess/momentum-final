import { supabase } from '../../config/supabase';
import { ProfileRow } from '../types/database';
import { logEvent, Events } from '../utils/analytics';
import { useAuthStore } from '../stores/authStore';

// Enhanced Match interface with additional data
export interface MatchWithDetails {
  id: string;
  otherUser: ProfileRow;
  created_at: string;
  distanceKm?: number;
  commonSports?: string[];
  lastMessageAt?: string;
  unreadCount?: number;
}

// Match notification interface
export interface MatchNotification {
  id: string;
  matched_user_id: string;
  created_at: string;
  seen: boolean;
  matchedUser?: ProfileRow;
}

/**
 * Get all matches for the current user using optimized RPC function
 * Returns matches with full profile information and distance data
 */
export const getUserMatches = async (): Promise<MatchWithDetails[]> => {
  try {
    const { user } = useAuthStore.getState();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('Fetching matches for user:', user.id);

    // Use the optimized RPC function to get matches with profile data
    const { data: matchesData, error: rpcError } = await supabase
      .rpc('get_user_matches', { user_id: user.id });

    if (rpcError) {
      console.error('Error fetching matches via RPC:', rpcError);
      // Fallback to manual query if RPC fails
      return await getMatchesManual(user.id);
    }

    if (!matchesData || matchesData.length === 0) {
      console.log('No matches found for user');
      logEvent(Events.SCREEN_VIEWED, {
        screen: 'matches',
        matchCount: 0,
      });
      return [];
    }

    console.log(`Found ${matchesData.length} matches`);

    // Transform RPC result to MatchWithDetails[] format
    const matches: MatchWithDetails[] = matchesData.map((match: any) => ({
      id: match.match_id,
      otherUser: {
        id: match.other_user_id,
        full_name: match.other_user_name,
        avatar_urls: match.other_user_avatar_urls || [],
        gender: match.other_user_gender,
        date_of_birth: null, // Calculate from age if needed
        interested_in: null,
        preferred_sports: match.other_user_sports || [],
        availability: null,
        created_at: null,
        lat: null,
        lng: null,
      },
      created_at: match.match_created_at,
      distanceKm: match.distance_km ? Number(match.distance_km) : undefined,
      commonSports: match.other_user_sports || [],
    }));

    logEvent(Events.SCREEN_VIEWED, {
      screen: 'matches',
      matchCount: matches.length,
    });

    return matches;

  } catch (error) {
    console.error('Error in getUserMatches:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

/**
 * Fallback function for manual match fetching if RPC fails
 */
const getMatchesManual = async (userId: string): Promise<MatchWithDetails[]> => {
  try {
    console.log('Using manual match fetching fallback');
    
    // Get matches where user is either user_a or user_b
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select(`
        id,
        user_a,
        user_b,
        created_at
      `)
      .or(`user_a.eq.${userId},user_b.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (matchesError) {
      console.error('Error fetching matches manually:', matchesError);
      throw matchesError;
    }

    if (!matches || matches.length === 0) {
      return [];
    }

    // Get the other user's profile for each match
    const matchesWithProfiles: MatchWithDetails[] = [];
    
    for (const match of matches) {
      const otherUserId = match.user_a === userId ? match.user_b : match.user_a;
      
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

    return matchesWithProfiles;
  } catch (error) {
    console.error('Error in getMatchesManual:', error);
    throw error;
  }
};

/**
 * Get unread match notifications for the current user
 */
export const getMatchNotifications = async (): Promise<MatchNotification[]> => {
  try {
    const { user } = useAuthStore.getState();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get unread match notifications
    const { data: notifications, error: notificationsError } = await supabase
      .from('match_notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('seen', false)
      .order('created_at', { ascending: false });

    if (notificationsError) {
      console.error('Error fetching match notifications:', notificationsError);
      throw notificationsError;
    }

    if (!notifications || notifications.length === 0) {
      return [];
    }

    // Fetch matched user profiles
    const notificationsWithProfiles: MatchNotification[] = [];
    
    for (const notification of notifications) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', notification.matched_user_id)
        .single();

      if (profileError) {
        console.error('Error fetching profile for notification:', profileError);
        continue;
      }

      if (profile) {
        notificationsWithProfiles.push({
          id: notification.id,
          matched_user_id: notification.matched_user_id,
          created_at: notification.created_at,
          seen: notification.seen,
          matchedUser: profile,
        });
      }
    }

    return notificationsWithProfiles;

  } catch (error) {
    console.error('Error in getMatchNotifications:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

/**
 * Mark match notifications as seen
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
      throw error;
    }

    logEvent(Events.NOTIFICATION_PRESSED, {
      action: 'mark_as_seen',
      notificationIds: notificationIds.join(','),
    });

  } catch (error) {
    console.error('Error in markMatchNotificationsAsSeen:', error);
    throw error;
  }
};

/**
 * Create test matches for development/testing purposes
 */
export const createTestMatches = async (): Promise<void> => {
  try {
    const { user } = useAuthStore.getState();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('Creating test matches for user:', user.id);

    // Test user IDs from your profiles data
    const testUserIds = [
      '550e8400-e29b-41d4-a716-446655440002', // David Johnson
      '550e8400-e29b-41d4-a716-446655440004', // Marcus Williams
      '550e8400-e29b-41d4-a716-446655440006', // Alex Rodriguez
    ];

    // Create mutual swipes to trigger matches
    for (const testUserId of testUserIds) {
      // Create swipe from current user to test user
      const { error: swipe1Error } = await supabase
        .from('swipes')
        .insert({
          swiper_id: user.id,
          swiped_id: testUserId,
          action: 'challenge',
          created_at: new Date().toISOString(),
        });

      if (swipe1Error) {
        console.error('Error creating swipe 1:', swipe1Error);
        continue;
      }

      // Create swipe from test user to current user (this should trigger match)
      const { error: swipe2Error } = await supabase
        .from('swipes')
        .insert({
          swiper_id: testUserId,
          swiped_id: user.id,
          action: 'challenge',
          created_at: new Date().toISOString(),
        });

      if (swipe2Error) {
        console.error('Error creating swipe 2:', swipe2Error);
        continue;
      }

      console.log(`Created mutual swipes between ${user.id} and ${testUserId}`);
    }

    logEvent('test_matches_created', {
      userId: user.id,
      testMatchCount: testUserIds.length,
    });

    console.log('Test matches creation completed');

  } catch (error) {
    console.error('Error in createTestMatches:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

/**
 * Clean up test data (remove test matches and swipes)
 */
export const cleanupTestData = async (): Promise<void> => {
  try {
    const { user } = useAuthStore.getState();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('Cleaning up test data for user:', user.id);

    // Delete swipes involving current user
    const { error: swipesError } = await supabase
      .from('swipes')
      .delete()
      .or(`swiper_id.eq.${user.id},swiped_id.eq.${user.id}`);

    if (swipesError) {
      console.error('Error deleting swipes:', swipesError);
    }

    // Delete matches involving current user
    const { error: matchesError } = await supabase
      .from('matches')
      .delete()
      .or(`user_a.eq.${user.id},user_b.eq.${user.id}`);

    if (matchesError) {
      console.error('Error deleting matches:', matchesError);
    }

    // Delete match notifications for current user
    const { error: notificationsError } = await supabase
      .from('match_notifications')
      .delete()
      .eq('user_id', user.id);

    if (notificationsError) {
      console.error('Error deleting notifications:', notificationsError);
    }

    logEvent('test_data_cleaned', {
      userId: user.id,
    });

    console.log('Test data cleanup completed');

  } catch (error) {
    console.error('Error in cleanupTestData:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};
