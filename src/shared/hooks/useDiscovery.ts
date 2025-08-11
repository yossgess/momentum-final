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
  ProfileWithDistance,
  BatchFetchParams 
} from '../services/discoveryService';
import { pushNotificationService } from '../services/pushNotificationService';
import { useNotificationsStore } from '../../features/notifications/store/notifications.store';
import { Notification } from '../../features/notifications/constants/notificationTypes';
import { logEvent, Events } from '../utils/analytics';
import { getSportByName } from '../../constants/sports';
import { Sport } from '../types/sports';

export const useDiscovery = (filters: DiscoveryFilters) => {
  const queryClient = useQueryClient();
  const [isHookInitialized, setIsHookInitialized] = React.useState(false);
  
  // Zustand store
  const {
    profilesQueue,
    currentIndex,
    skippedProfiles,
    totalFetched,
    isLoadingBatch,
    showMatchModal,
    matchedProfile,
    isLoading: storeLoading,
    error: storeError,
    setProfiles,
    addProfiles,
    advance,
    revert,
    showMatch,
    hideMatch,
    setLoading,
    setLoadingBatch,
    setError,
    getCurrentProfile,
    hasProfiles,
    canRevert,
    needsMoreProfiles,
    getRemainingProfilesCount,
  } = useDiscoveryStore();

  // Initial batch fetch for discovery profiles - Load a larger batch upfront
  const {
    data: initialProfiles,
    isLoading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['discovery-profiles', 'initial'],
    queryFn: async () => {
      const profiles = await getDiscoveryProfiles({ limit: 20, offset: 0 }); // Load 20 profiles upfront
      return profiles;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Batch fetch mutation for loading more profiles
  const fetchMoreMutation = useMutation({
    mutationFn: async (batchParams: BatchFetchParams) => {
      return await getDiscoveryProfiles(batchParams);
    },
    onMutate: () => {
      setLoadingBatch(true);
    },
    onSuccess: (newProfiles) => {
      addProfiles(newProfiles);
      setLoadingBatch(false); // Always clear loading state
      logEvent('profiles_batch_loaded', {
        batchSize: newProfiles.length,
        totalInQueue: profilesQueue.length + newProfiles.length,
        remainingProfiles: getRemainingProfilesCount() + newProfiles.length,
      });
    },
    onError: (error) => {
      console.error('Error fetching more profiles:', error);
      setLoadingBatch(false); // Always clear loading state
      // Don't set error for batch fetches, just log it
      logEvent('profiles_batch_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        offset: totalFetched,
      });
    },
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

  // Initialize hook with stable state
  React.useEffect(() => {
    const initializeHook = async () => {
      console.log('[DISCOVERY_HOOK] Initializing useDiscovery hook...');
      
      // Small delay to ensure stable initialization
      await new Promise(resolve => setTimeout(resolve, 50));
      
      setIsHookInitialized(true);
      console.log('[DISCOVERY_HOOK] Hook initialization complete');
    };

    initializeHook();
  }, []);

  // Handle initial profiles fetch
  React.useEffect(() => {
    if (initialProfiles && isHookInitialized) {
      // Transform profiles to include Sport objects for components
      const transformedProfiles = initialProfiles.map(profile => ({
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
        isInitialBatch: true,
      });
    }
  }, [initialProfiles, isHookInitialized, transformSportsToObjects, setProfiles, setError, filters]);

  // Auto-fetch more profiles when running low (only when user has 5 or fewer profiles left)
  React.useEffect(() => {
    const remainingProfiles = profilesQueue.length - currentIndex;
    if (remainingProfiles <= 5 && remainingProfiles > 0 && !isLoadingBatch && !fetchMoreMutation.isPending && totalFetched > 0) {
      // Fetch next batch with offset - larger batch for better performance
      fetchMoreMutation.mutate({
        limit: 15,
        offset: totalFetched,
      });
    }
  }, [currentIndex, profilesQueue.length, isLoadingBatch, totalFetched]);

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
    mutationFn: async ({ swipedId, action }: { swipedId: string; action: 'challenge' | 'nope' }) => {
      return await swipeUser(swipedId, action);
    },
    onSuccess: async (result, { swipedId, action }) => {
      // Move current profile to skipped profiles for potential revert
      const currentProfile = getCurrentProfile();
      if (currentProfile) {
        useDiscoveryStore.setState(state => ({
          skippedProfiles: [...state.skippedProfiles, currentProfile]
        }));
      }

      // Advance to next profile
      advance();

      // Handle match if one was created
      if (result.isMatch && result.matchData && currentProfile) {
        // Show match modal immediately
        showMatch(currentProfile);
        
        console.log('🎉 MATCH FOUND! Creating match event...');
        logEvent('match_created', {
          matchId: result.matchData.id,
          matchedUserId: swipedId,
        });

        // Send push notification for the match
        const matchedUserName = result.matchData.otherUser.full_name || 'Someone';
        await pushNotificationService.sendMatchNotification(matchedUserName, result.matchData.id);

        // Add notification to the notification store (deferred to avoid useInsertionEffect warning)
        const matchData = result.matchData; // Capture match data for closure
        setTimeout(() => {
          const { addNotification } = useNotificationsStore.getState();
          const matchNotification: Notification<'match'> = {
            id: `match_${matchData.id}_${Date.now()}`,
            type: 'match',
            timestamp: Date.now(),
            isRead: false,
            data: {
              user: matchedUserName,
              userId: swipedId,
              userPhoto: matchData.otherUser.avatar_urls?.[0],
            }
          };
          addNotification(matchNotification);
        }, 0);

        // TODO: Chat creation will be implemented later
        // const chatId = await createChatForMatch(result.matchData.id, swipedId);
        
        logEvent('match_created', {
          matchId: result.matchData.id,
          matchedUserId: swipedId,
          chatId: 'chat_module_not_implemented_yet',
          notificationSent: true,
        });
        
        // Refresh notifications to update badge
        await refetchNotifications();
      }

      // Auto-fetch more profiles if we're running low after swipe
      // The useEffect above will handle this automatically
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
        profilesRemaining: profilesQueue.length - currentIndex,
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
    // Reset store and refetch initial batch
    useDiscoveryStore.getState().reset();
    refetch();
  };

  // Combined loading state
  const isLoading = queryLoading || storeLoading || swipeMutation.isPending || revertMutation.isPending;

  // Combined error state
  const error = storeError || (queryError instanceof Error ? queryError.message : null);

  // Get unread notification count from notification store
  const { getUnreadCount } = useNotificationsStore();
  const notificationCount = getUnreadCount();

  return {
    // Data
    profiles: profilesQueue,
    currentProfile: getCurrentProfile(),
    currentIndex,
    hasProfiles: hasProfiles(),
    notifications,
    notificationCount,
    remainingProfilesCount: getRemainingProfilesCount(),

    // Modal state
    showMatchModal,
    matchedProfile,

    // Loading and error states
    isLoading,
    isLoadingBatch,
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
    
    // Match result for debugging
    lastSwipeResult: swipeMutation.data,
  };
};
