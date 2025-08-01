import { supabase } from '../../config/supabase';
import { ProfileRow } from '../types/database';
import { logEvent, Events } from '../utils/analytics';

// Discovery filters interface
export interface DiscoveryFilters {
  gender?: 'man' | 'woman';
  interestedIn?: 'men' | 'women' | 'any';
  minAge?: number;
  maxAge?: number;
  sports?: string[];
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
 * Get filtered discovery profiles for the current user
 * Excludes already swiped users and existing matches
 * TODO: Replace with Supabase RPC function for better performance
 */
export const getDiscoveryProfiles = async (filters: DiscoveryFilters): Promise<ProfileRow[]> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    logEvent(Events.SEARCH_PERFORMED, {
      filters: JSON.stringify(filters),
      userId: user.id,
    });

    // TODO: This should be replaced with a Supabase RPC function for better performance
    // For now, we'll fetch all profiles and filter client-side
    
    // Get all profiles except current user
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user.id)
      .not('full_name', 'is', null); // Only include profiles with names

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw profilesError;
    }

    if (!profiles) {
      return [];
    }

    // Get already swiped user IDs
    const { data: swipes, error: swipesError } = await supabase
      .from('swipes')
      .select('swiped_id')
      .eq('user_id', user.id);

    if (swipesError) {
      console.error('Error fetching swipes:', swipesError);
      throw swipesError;
    }

    const swipedUserIds = new Set(swipes?.map(swipe => swipe.swiped_id) || []);

    // Get existing match user IDs
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('user_a, user_b')
      .or(`user_a.eq.${user.id},user_b.eq.${user.id}`);

    if (matchesError) {
      console.error('Error fetching matches:', matchesError);
      throw matchesError;
    }

    const matchedUserIds = new Set(
      matches?.map(match => 
        match.user_a === user.id ? match.user_b : match.user_a
      ) || []
    );

    // Filter profiles
    let filteredProfiles = profiles.filter(profile => {
      // Exclude already swiped users
      if (swipedUserIds.has(profile.id)) return false;
      
      // Exclude existing matches
      if (matchedUserIds.has(profile.id)) return false;

      return true;
    });

    // Apply client-side filters
    // TODO: Move these filters to the database query for better performance
    if (filters.gender) {
      filteredProfiles = filteredProfiles.filter(profile => 
        profile.gender === filters.gender
      );
    }

    if (filters.interestedIn) {
      // Filter based on what the current user is interested in
      const currentUserProfile = await getCurrentUserProfile();
      if (currentUserProfile?.gender) {
        const userGender = currentUserProfile.gender;
        filteredProfiles = filteredProfiles.filter(profile => {
          if (!profile.interested_in) return true; // Include if no preference set
          
          if (filters.interestedIn === 'any') return true;
          
          // Check if the profile's interested_in matches current user's gender
          if (filters.interestedIn === 'men' && userGender === 'man') return profile.interested_in === 'men' || profile.interested_in === 'any';
          if (filters.interestedIn === 'women' && userGender === 'woman') return profile.interested_in === 'women' || profile.interested_in === 'any';
          
          return true;
        });
      }
    }

    // Age filtering
    if (filters.minAge || filters.maxAge) {
      const currentDate = new Date();
      filteredProfiles = filteredProfiles.filter(profile => {
        if (!profile.date_of_birth) return true; // Include if no DOB set
        
        const birthDate = new Date(profile.date_of_birth);
        const age = currentDate.getFullYear() - birthDate.getFullYear();
        
        if (filters.minAge && age < filters.minAge) return false;
        if (filters.maxAge && age > filters.maxAge) return false;
        
        return true;
      });
    }

    // Sports filtering
    if (filters.sports && filters.sports.length > 0) {
      filteredProfiles = filteredProfiles.filter(profile => {
        if (!profile.preferred_sports || profile.preferred_sports.length === 0) return false;
        
        // Check if any of the user's preferred sports match the filter
        return filters.sports!.some(sport => 
          profile.preferred_sports!.includes(sport)
        );
      });
    }

    logEvent(Events.SEARCH_PERFORMED, {
      resultsCount: filteredProfiles.length,
      filtersApplied: Object.keys(filters).length,
    });

    return filteredProfiles;

  } catch (error) {
    console.error('Error in getDiscoveryProfiles:', error);
    throw error;
  }
};

/**
 * Record a swipe action (challenge or nope)
 * Inserts into swipes table and triggers matching logic via DB trigger
 */
export const swipeUser = async (swipedId: string, action: 'challenge' | 'nope'): Promise<void> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Log the swipe action
    logEvent('swipe_action', {
      action,
      targetUser: swipedId,
      userId: user.id,
    });

    // Insert swipe record
    const { error: swipeError } = await supabase
      .from('swipes')
      .insert({
        user_id: user.id,
        swiped_id: swipedId,
        action: action,
        created_at: new Date().toISOString(),
      });

    if (swipeError) {
      console.error('Error recording swipe:', swipeError);
      throw swipeError;
    }

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
    throw error;
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
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError) {
      console.error('Error fetching last swipe:', fetchError);
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
      throw deleteError;
    }

    logEvent('swipe_reverted', {
      revertedSwipeId: lastSwipe.id,
      revertedAction: lastSwipe.action,
      targetUser: lastSwipe.swiped_id,
    });

  } catch (error) {
    console.error('Error in revertLastSwipe:', error);
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
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error);
    return null;
  }
};
