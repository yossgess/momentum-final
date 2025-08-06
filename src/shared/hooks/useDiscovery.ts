import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDiscoveryStore } from '../stores/discoveryStore';
import { 
  getDiscoveryProfiles, 
  swipeUser, 
  getMatchNotifications,
  markMatchNotificationsAsSeen,
  revertLastSwipe,
  DiscoveryFilters,
  ProfileWithDistance 
} from '../services/discoveryService';
import { logEvent, Events } from '../utils/analytics';
import { getSportByName } from '../../constants/sports';
import { Sport } from '../types/sports';

export const useDiscovery = (filters: DiscoveryFilters) => {
  const queryClient = useQueryClient();
  
  // Zustand store
  const {
    profiles,
    currentIndex,
    skippedProfiles,
    showMatchModal,
    matchedProfile,
    isLoading: storeLoading,
    error: storeError,
    setProfiles,
    advance,
    revert,
    showMatch,
    hideMatch,
    setLoading,
    setError,
    getCurrentProfile,
    hasProfiles,
    canRevert,
  } = useDiscoveryStore();

  // Query for discovery profiles
  const {
    data: fetchedProfiles,
    isLoading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['discovery-profiles'],
    queryFn: async () => {
      const profiles = await getDiscoveryProfiles();
      return profiles;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
  });

  // Transform sports data helper function
  const transformSportsToObjects = React.useCallback((sportNames: string[]): Sport[] => {
    if (!sportNames || sportNames.length === 0) {
      return [];
    }
    
    return sportNames
      .map(name => getSportByName(name))
      .filter((sport): sport is Sport => sport !== undefined);
  }, []);

  // Handle successful data fetch
  React.useEffect(() => {
    if (fetchedProfiles) {
      // Transform profiles to include Sport objects for components
      const transformedProfiles = fetchedProfiles.map(profile => ({
        ...profile,
        sports: transformSportsToObjects(profile.userSports || []),
        sharedSports: transformSportsToObjects(profile.commonSports || []),
      }));
      
      setProfiles(transformedProfiles);
      setError(null);
      logEvent('search_results_loaded', {
        profileCount: transformedProfiles.length,
        filters: JSON.stringify(filters),
        avgCommonSports: transformedProfiles.reduce((sum, p) => sum + (p.sharedSports?.length || 0), 0) / transformedProfiles.length,
      });
    }
  }, [fetchedProfiles, filters, setProfiles, setError, transformSportsToObjects]);

  // Handle query errors
  React.useEffect(() => {
    if (queryError) {
      console.error('Error fetching discovery profiles:', queryError);
      setError(queryError instanceof Error ? queryError.message : 'Failed to load profiles');
    }
  }, [queryError, setError]);

  // Query for match notifications (for badge count)
  const {
    data: notifications,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: ['match-notifications'],
    queryFn: getMatchNotifications,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });

  // Swipe mutation
  const swipeMutation = useMutation({
    mutationFn: ({ swipedId, action }: { swipedId: string; action: 'challenge' | 'nope' }) =>
      swipeUser(swipedId, action),
    onSuccess: async (_, { swipedId, action }) => {
      // Move current profile to skipped profiles for potential revert
      const currentProfile = getCurrentProfile();
      if (currentProfile) {
        useDiscoveryStore.setState(state => ({
          skippedProfiles: [...state.skippedProfiles, currentProfile]
        }));
      }

      // Advance to next profile
      advance();

      // Check for new match notifications after challenge
      if (action === 'challenge') {
        await refetchNotifications();
        
        // Check if this created a match
        const updatedNotifications = await getMatchNotifications();
        const newMatch = updatedNotifications.find(n => n.matched_user_id === swipedId);
        
        if (newMatch && currentProfile) {
          // Show match modal
          showMatch(currentProfile);
          logEvent(Events.MATCH_CREATED, {
            matchedUserId: swipedId,
          });
        }
      }

      // Invalidate and refetch profiles if we're running low
      if (!hasProfiles()) {
        queryClient.invalidateQueries({ queryKey: ['discovery-profiles'] });
      }
    },
    onError: (error) => {
      console.error('Error swiping user:', error);
      setError(error instanceof Error ? error.message : 'Failed to record swipe');
    },
  });

  // Revert last swipe mutation
  const revertMutation = useMutation({
    mutationFn: revertLastSwipe,
    onSuccess: () => {
      revert();
      logEvent('swipe_reverted', {
        profilesRemaining: profiles.length - currentIndex,
      });
    },
    onError: (error) => {
      console.error('Error reverting swipe:', error);
      setError(error instanceof Error ? error.message : 'Failed to revert swipe');
    },
  });

  // Mark notifications as seen mutation
  const markNotificationsSeenMutation = useMutation({
    mutationFn: (notificationIds: string[]) => markMatchNotificationsAsSeen(notificationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match-notifications'] });
    },
    onError: (error) => {
      console.error('Error marking notifications as seen:', error);
    },
  });

  // Actions
  const handleSwipe = (action: 'challenge' | 'nope') => {
    const currentProfile = getCurrentProfile();
    if (!currentProfile) return;

    swipeMutation.mutate({
      swipedId: currentProfile.id,
      action,
    });
  };

  const handleRevert = () => {
    if (canRevert()) {
      revertMutation.mutate();
    }
  };

  const handleMatchModalOpen = () => {
    logEvent(Events.MATCH_MODAL_VIEWED, {
      matchedUserId: matchedProfile?.id,
    });

    // Mark match notifications as seen when modal opens
    if (notifications && Array.isArray(notifications) && notifications.length > 0) {
      const notificationIds = notifications.map((n: any) => n.id);
      markNotificationsSeenMutation.mutate(notificationIds);
    }
  };

  const handleMatchModalClose = () => {
    hideMatch();
    logEvent(Events.MODAL_CLOSED, {
      modalType: 'match',
    });
  };

  const refreshProfiles = () => {
    refetch();
  };

  // Combined loading state
  const isLoading = queryLoading || storeLoading || swipeMutation.isPending || revertMutation.isPending;

  // Combined error state
  const error = storeError || (queryError instanceof Error ? queryError.message : null);

  return {
    // Data
    profiles,
    currentProfile: getCurrentProfile(),
    currentIndex,
    hasProfiles: hasProfiles(),
    notifications,
    notificationCount: Array.isArray(notifications) ? notifications.length : 0,

    // Modal state
    showMatchModal,
    matchedProfile,

    // Loading and error states
    isLoading,
    error,

    // Actions
    handleSwipe,
    handleRevert,
    canRevert: canRevert(),
    refreshProfiles,

    // Match modal actions
    handleMatchModalOpen,
    handleMatchModalClose,

    // Mutations
    isSwipeLoading: swipeMutation.isPending,
    isRevertLoading: revertMutation.isPending,
  };
};
