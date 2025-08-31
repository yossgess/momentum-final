import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Components
import { Typography } from '../../../components/atoms/Typography';
import { Loader } from '../../../components/atoms/Loader';
import { EmptyState } from '../../../components/molecules/EmptyState';
import { FilterButton } from '../../../components/molecules/FilterButton';
import { NotificationButton } from '../../../components/atoms/NotificationButton';
import { SwipeCard } from '../../../components/business/SwipeCard';
import { ImageCarousel } from '../../../components/business/ImageCarousel';
import { FiltersChipGroup } from '../../../components/business/FiltersChipGroup';
import { ChallengeButton } from '../../../components/business/ChallengeButton';
import { NopeButton } from '../../../components/business/NopeButton';
import { RevertButton } from '../../../components/business/RevertButton';
import { MatchModal } from '../../../components/business/MatchModal';
import { ProfileModal } from '../../../components/business/ProfileModal';
import { FilterModal } from '../components/FilterModal';
import { LocationEmptyState } from '../components/LocationEmptyState';

// Utils & Types
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { t } from '../../../shared/utils/i18n';
import { useDiscoverFiltersStore } from '../components/useDiscoverFiltersStore';
import { getSportIcon } from '../../../constants/sportIcons';
import { useDiscovery } from '../../../shared/hooks/useDiscovery';
import { DiscoveryFilters, ProfileWithDistance } from '../../../shared/services/discoveryService';
import { ProfileRow } from '../../../shared/types/database';
import { locationService } from '../../../shared/services/locationService';
import { useAuthStore } from '../../../shared/stores/authStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const DiscoveryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user } = useAuthStore();
  
  // Local state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [hasLocation, setHasLocation] = useState<boolean | null>(null); // null = checking, true/false = result
  const [showActionIcon, setShowActionIcon] = useState<'challenge' | 'nope' | null>(null);
  const [isDiscoveryInitialized, setIsDiscoveryInitialized] = useState(false);
  
  // Filter store
  const { distanceKm, ageRange, interestedIn, sports, isApplied } = useDiscoverFiltersStore();
  
  // Direct mapping - interfaces are now aligned
  const discoveryFilters: DiscoveryFilters = useMemo(() => ({
    interestedIn,
    ageRange,
    sports,
    distanceKm: distanceKm, // Now using consistent field name
  }), [interestedIn, ageRange, sports, distanceKm]);
  
  // Discovery hook with integrated service layer
  const {
    currentProfile,
    hasProfiles,
    notificationCount,
    remainingProfilesCount,
    showMatchModal,
    matchedProfile,
    isLoading,
    isLoadingBatch,
    error,
    handleSwipe,
    handleRevert,
    canRevert,
    refreshProfiles,
    handleMatchModalOpen,
    handleMatchModalClose,
    isSwipeLoading,
    isRevertLoading,
  } = useDiscovery(discoveryFilters);
  
  // Calculate active filters count
  const activeFilters = (
    (distanceKm !== 25 ? 1 : 0) +
    (ageRange[0] !== 18 || ageRange[1] !== 35 ? 1 : 0) +
    (interestedIn !== 'any' ? 1 : 0) +
    (sports.length > 0 ? 1 : 0)
  );

  // Animation refs
  const cardAnimatedValue = useRef(new Animated.Value(0)).current;
  const iconAnimatedValue = useRef(new Animated.Value(0)).current;

  // Initialize DiscoveryScreen with stable state
  React.useEffect(() => {
    const initializeDiscovery = async () => {
      console.log('[DISCOVERY] Initializing DiscoveryScreen...');
      
      // Small delay to ensure navigation transition is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setIsDiscoveryInitialized(true);
      console.log('[DISCOVERY] DiscoveryScreen initialization complete');
    };

    initializeDiscovery();
  }, []);

  // Check user location on component mount
  React.useEffect(() => {
    const checkLocation = async () => {
      if (user?.id && isDiscoveryInitialized) {
        const userHasLocation = await locationService.checkUserHasLocation(user.id);
        
        // If user doesn't have location, check if permission was already requested during onboarding
        if (!userHasLocation) {
          try {
            const { useUserStore } = await import('../../../shared/stores/userStore');
            const profile = useUserStore.getState().profile;
            
            // If location permission was already requested during onboarding and denied,
            // don't show EmptyLocationScreen - proceed with discovery without location
            if (profile?.location_permission_requested) {
              console.log('[DISCOVERY] Location permission was already requested during onboarding - proceeding without location');
              setHasLocation(true); // Allow discovery to proceed without location
              return;
            }
          } catch (error) {
            console.warn('[DISCOVERY] Failed to check onboarding location permission state:', error);
          }
        }
        
        setHasLocation(userHasLocation);
      }
    };

    checkLocation();
  }, [user?.id, isDiscoveryInitialized]);

  // Mock current user for MatchModal - TODO: Get from auth store
  const currentUser = {
    id: 'current_user',
    email: 'current@example.com',
    firstName: 'You',
    lastName: 'User',
    age: 25,
    gender: 'male' as const,
    bio: 'Current user',
    photos: ['https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=600&fit=crop'],
    location: {
      latitude: 0,
      longitude: 0,
      city: 'City',
      country: 'Country'
    },
    sports: [],
    preferences: {
      ageRange: [18, 35] as [number, number],
      maxDistance: 25,
      genderPreference: 'both' as const,
      sportsInterests: []
    }
  };

  useEffect(() => {
    logEvent(Events.SCREEN_VIEWED, { screenName: 'Discovery' });
  }, []);

  // Handle errors with user feedback
  useEffect(() => {
    if (error) {
      Alert.alert(
        t('discovery.error.title'),
        error,
        [
          {
            text: t('common.retry'),
            onPress: refreshProfiles,
          },
          {
            text: t('common.cancel'),
            style: 'cancel',
          },
        ]
      );
    }
  }, [error, refreshProfiles]);

  // Icon overlay animation
  const animateActionIcon = (actionType: 'challenge' | 'nope') => {
    setShowActionIcon(actionType);
    
    // Log animation event for analytics
    logEvent(Events.PROFILE_VIEWED, {
      profileId: currentProfile?.id || 'unknown',
      action: `${actionType}_icon_animation`,
      animationType: 'fade_scale',
    });
    
    // Reset icon animation
    iconAnimatedValue.setValue(0);
    
    // Animate icon appearance (fade in + scale)
    Animated.timing(iconAnimatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // After icon animation, wait briefly then hide icon and start card transition
      setTimeout(() => {
        setShowActionIcon(null);
        iconAnimatedValue.setValue(0);
      }, 150);
    });
  };

  // Card transition animation
  const animateCardTransition = (direction: 'up' | 'down') => {
    const toValue = direction === 'up' ? -SCREEN_HEIGHT : SCREEN_HEIGHT;
    
    Animated.timing(cardAnimatedValue, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      cardAnimatedValue.setValue(direction === 'up' ? SCREEN_HEIGHT : -SCREEN_HEIGHT);
      Animated.timing(cardAnimatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  // Handle Challenge action
  const handleChallenge = () => {
    if (!currentProfile) return;
    
    logEvent(Events.CHALLENGE_BUTTON_PRESSED, {
      targetUserId: currentProfile.id,
      targetUserGender: currentProfile.gender || 'unknown',
      targetUserSports: '', // Sports data now comes from filter_preferences table
    });
    
    // Show action icon first, then animate card transition
    animateActionIcon('challenge');
    
    // Delay card transition to sync with icon animation
    setTimeout(() => {
      animateCardTransition('up');
      // Use service layer to handle swipe
      handleSwipe('challenge');
    }, 350); // 200ms icon animation + 150ms delay
  };

  // Handle Nope action
  const handleNope = () => {
    if (!currentProfile) return;
    
    logEvent(Events.NOPE_BUTTON_PRESSED, {
      targetUserId: currentProfile.id,
    });
    
    // Show action icon first, then animate card transition
    animateActionIcon('nope');
    
    // Delay card transition to sync with icon animation
    setTimeout(() => {
      animateCardTransition('up');
      // Use service layer to handle swipe
      handleSwipe('nope');
    }, 350); // 200ms icon animation + 150ms delay
  };

  // Handle Revert action
  const handleRevertAction = () => {
    if (!canRevert) return;
    
    logEvent('revert_button_pressed', {
      canRevert,
    });
    
    // Animate card transition
    animateCardTransition('down');
    
    // Use service layer to handle revert
    handleRevert();
  };

  // Handle Filter button
  const handleFilterPress = () => {
    logEvent(Events.BUTTON_PRESSED, { buttonType: 'filter', screenName: 'Discovery' });
    setShowFilterModal(true);
  };

  // Handle Filter Modal close
  const handleFilterModalClose = () => {
    setShowFilterModal(false);
  };

  // Handle Profile Modal
  const handleProfilePress = () => {
    if (!currentProfile) return;
    
    console.log('🔍 ProfileModal: Opening profile modal for:', currentProfile.id);
    logEvent('profile_card_pressed', {
      profileId: currentProfile.id,
      source: 'discovery_screen'
    });
    setShowProfileModal(true);
  };

  const handleProfileModalClose = () => {
    logEvent(Events.MODAL_CLOSED, { modalType: 'profile_details' });
    setShowProfileModal(false);
  };

  const handleProfileModalChallenge = () => {
    setShowProfileModal(false);
    handleChallenge();
  };

  const handleProfileModalNope = () => {
    setShowProfileModal(false);
    handleNope();
  };

  const handleProfileModalRevert = () => {
    setShowProfileModal(false);
    handleRevertAction();
  };

  // Handle Notification button
  const handleNotificationPress = () => {
    logEvent(Events.NOTIFICATION_PRESSED, {
      unreadCount: notificationCount,
    });
    
    // Navigate to independent notifications screen
    navigation.navigate('Notifications');
  };

  // Handle Match Modal actions
  const handleSendMessage = () => {
    if (!matchedProfile) return;
    
    logEvent(Events.CHAT_BUTTON_PRESSED, {
      matchedUserId: matchedProfile.id,
    });
    
    handleMatchModalClose();
    // TODO: Navigate to chat with matched user
    console.log('Navigate to chat with:', matchedProfile.full_name);
  };

  const handleKeepSwiping = () => {
    handleMatchModalClose();
  };

  const handleCloseModal = () => {
    handleMatchModalClose();
  };

  const handleContinueDiscovery = () => {
    handleMatchModalClose();
  };

  // Handle match modal open with analytics
  const handleMatchModalOpenWithAnalytics = () => {
    handleMatchModalOpen();
  };

  // Handle empty state edit filters action
  const handleEditFilters = () => {
    logEvent(Events.BUTTON_PRESSED, { buttonName: 'EditFilters', source: 'EmptyState' });
    setShowFilterModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>


      {/* Main Content - Show instantly when profile is available from queue */}
      {currentProfile && (
        <Animated.View 
          style={[
            styles.swipeCardContainer,
            {
              transform: [{ translateY: cardAnimatedValue }],
            },
          ]}
        >
          <SwipeCard
            profile={{
              id: currentProfile.id,
              name: currentProfile.full_name || 'Unknown',
              age: currentProfile.date_of_birth ? 
                new Date().getFullYear() - new Date(currentProfile.date_of_birth).getFullYear() : 
                25, // Default age if not available
              bio: '', // TODO: Add bio field to ProfileRow
              images: currentProfile.avatar_urls || [], // Changed from photos to images
              sports: (currentProfile as any).sports || [], // Dynamic sports from useDiscovery hook
              sharedSports: (currentProfile as any).sharedSports || [], // Dynamic common sports from useDiscovery hook
              location: '', // TODO: Add location field to ProfileRow
              distanceInKm: (currentProfile as ProfileWithDistance).distanceInKm, // Pass distance info
            }}
            onSwipeLeft={handleNope}
            onSwipeRight={handleChallenge}
            onPress={handleProfilePress}
            style={styles.swipeCard}
          />
          
          {/* Action Icon Overlay */}
          {showActionIcon && (
            <Animated.View 
              style={[
                styles.actionIconOverlay,
                {
                  opacity: iconAnimatedValue,
                  transform: [
                    {
                      scale: iconAnimatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              {showActionIcon === 'challenge' ? (
                <Image
                  source={require('../../../../assets/concurrence.png')}
                  style={styles.challengeIcon}
                  resizeMode="contain"
                />
              ) : (
                <Ionicons
                  name="close"
                  size={80}
                  color={theme.colors.status.error}
                />
              )}
            </Animated.View>
          )}
        </Animated.View>
      )}

      {/* Location Required State - Show when location is missing */}
      {hasLocation === false && (
        <LocationEmptyState 
          onLocationUpdated={() => {
            setHasLocation(null); // Reset to checking state
            // Re-check location after update
            if (user?.id) {
              locationService.checkUserHasLocation(user.id).then(setHasLocation);
            }
            refreshProfiles();
          }} 
        />
      )}

      {/* Loading State - Show when loading profiles */}
      {hasLocation === true && isLoading && !currentProfile && (
        <View style={styles.loadingContainer}>
          <Loader size="large" />
          <Typography variant="body" style={styles.loadingText}>
            {t('discovery.loading')}
          </Typography>
        </View>
      )}

      {/* Empty State - Show only when NOT loading and no profiles available */}
      {hasLocation === true && !isLoading && !currentProfile && !hasProfiles && (
        <EmptyState
          icon="people-outline"
          title={t('discovery.noMoreProfiles')}
          description={t('discovery.tryAdjustingFilters')}
          actionLabel={t('discovery.editFilters')}
          onAction={handleEditFilters}
          style={styles.emptyState}
        />
      )}

      {/* Match Modal */}
      <MatchModal
        visible={showMatchModal}
        currentUser={currentUser}
        matchedUser={matchedProfile ? {
          id: matchedProfile.id,
          email: '',
          firstName: matchedProfile.full_name?.split(' ')[0] || 'Unknown',
          lastName: matchedProfile.full_name?.split(' ').slice(1).join(' ') || '',
          age: matchedProfile.date_of_birth ? 
            new Date().getFullYear() - new Date(matchedProfile.date_of_birth).getFullYear() : 
            25,
          gender: matchedProfile.gender === 'man' ? 'male' : matchedProfile.gender === 'woman' ? 'female' : 'other',
          bio: '', // TODO: Add bio field
          photos: matchedProfile.avatar_urls || [],
          location: {
            latitude: matchedProfile.lat || 0,
            longitude: matchedProfile.lng || 0,
            city: 'Unknown',
            country: 'Unknown'
          },
          sports: [], // Sports data now comes from filter_preferences table
          preferences: {
            ageRange: [18, 35] as [number, number],
            maxDistance: 25,
            genderPreference: 'both' as const,
            sportsInterests: [] // Sports interests now come from filter_preferences table
          }
        } : currentUser}
        onSendMessage={handleSendMessage}
        onKeepSwiping={handleKeepSwiping}
        onClose={handleCloseModal}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={handleFilterModalClose}
        onFiltersApplied={refreshProfiles}
      />

      {/* Profile Modal */}
      <ProfileModal
        visible={showProfileModal}
        profile={currentProfile}
        onClose={handleProfileModalClose}
        onChallenge={handleProfileModalChallenge}
        onNope={handleProfileModalNope}
        onRevert={handleProfileModalRevert}
        canRevert={canRevert}
        isLoading={isSwipeLoading || isRevertLoading}
      />

      {/* Top Corner Buttons Overlay - Always visible */}
      <FilterButton
        onPress={handleFilterPress}
        active={activeFilters > 0}
        style={styles.topLeftButton}
      />
      
      <NotificationButton
        badgeCount={notificationCount}
        onPress={handleNotificationPress}
        style={styles.topRightButton}
      />



      {/* Bottom Action Buttons Overlay - Only show when there's a current profile */}
      {currentProfile && (
        <View style={styles.bottomActionButtons}>
          <NopeButton
            onPress={handleNope}
            size="lg"
            style={styles.actionButton}
          />
          <RevertButton
            onPress={handleRevertAction}
            disabled={!canRevert || isRevertLoading}
            size="lg"
            style={styles.actionButton}
          />
          <ChallengeButton
            onPress={handleChallenge}
            disabled={isSwipeLoading || !currentProfile}
            size="lg"
            style={styles.actionButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  topLeftButton: {
    position: 'absolute',
    top: 70, // Position further down from status bar
    left: theme.spacing.lg,
    zIndex: 1000, // Very high z-index to appear over SwipeCard
    width: 40,
    elevation: 10, // Android elevation for proper layering
  },
  topRightButton: {
    position: 'absolute',
    top: 70, // Position further down from status bar
    right: theme.spacing.lg,
    zIndex: 1000, // Very high z-index to appear over SwipeCard
    width: 40,
    elevation: 10, // Android elevation for proper layering
  },
  bottomActionButtons: {
    position: 'absolute',
    bottom: 80, // Position above bottom navigation bar
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    zIndex: 1000, // High z-index to appear over SwipeCard
    elevation: 10, // Android elevation for proper layering
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  filterButton: {
    width: 40,
  },
  notificationButton: {
    width: 40,
  },
  swipeCardContainer: {
    flex: 1,
    marginHorizontal: 0, // Remove horizontal margins for full width
    marginBottom: 0, // Remove bottom margin to extend to bottom nav
  },
  swipeCard: {
    flex: 1,
    marginBottom: 0, // Ensure it extends to bottom navigation
  },
  bottomActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
  },
  actionButton: {
    // Styles handled by individual button components
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.text.secondary,
  },
  actionIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001, // Above SwipeCard but below buttons
  },
  challengeIcon: {
    width: 80,
    height: 80,
    tintColor: theme.colors.primary.main,
  },
});
