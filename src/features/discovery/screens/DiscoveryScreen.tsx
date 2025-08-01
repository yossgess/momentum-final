import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

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
import { FilterModal } from '../components/FilterModal';

// Utils & Types
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { t } from '../../../shared/utils/i18n';
import { useDiscoverFiltersStore } from '../components/useDiscoverFiltersStore';
import { getSportIcon } from '../../../constants/sportIcons';
import { useDiscovery } from '../../../shared/hooks/useDiscovery';
import { DiscoveryFilters, ProfileWithDistance } from '../../../shared/services/discoveryService';
import { ProfileRow } from '../../../shared/types/database';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const DiscoveryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  // Local state
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Filter store
  const { distance, ageRange, gender, sports, isApplied } = useDiscoverFiltersStore();
  
  // Map filter store to service layer format
  const discoveryFilters: DiscoveryFilters = useMemo(() => ({
    gender: gender === 'men' ? 'man' : gender === 'women' ? 'woman' : undefined,
    interestedIn: gender === 'men' ? 'men' : gender === 'women' ? 'women' : 'any',
    ageRange: ageRange,
    sports: sports.length > 0 ? sports : undefined,
    distanceKm: distance, // Map distance from filter store
  }), [gender, ageRange, sports, distance]);
  
  // Discovery hook with integrated service layer
  const {
    currentProfile,
    hasProfiles,
    notificationCount,
    showMatchModal,
    matchedProfile,
    isLoading,
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
    (distance !== 25 ? 1 : 0) +
    (ageRange[0] !== 18 || ageRange[1] !== 35 ? 1 : 0) +
    (gender !== 'any' ? 1 : 0) +
    (sports.length > 0 ? 1 : 0)
  );

  // Animation refs
  const cardAnimatedValue = useRef(new Animated.Value(0)).current;

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
      targetUserSports: currentProfile.preferred_sports?.join(',') || '',
    });
    
    // Animate card transition
    animateCardTransition('up');
    
    // Use service layer to handle swipe
    handleSwipe('challenge');
  };

  // Handle Nope action
  const handleNope = () => {
    if (!currentProfile) return;
    
    logEvent(Events.NOPE_BUTTON_PRESSED, {
      targetUserId: currentProfile.id,
    });
    
    // Animate card transition
    animateCardTransition('up');
    
    // Use service layer to handle swipe
    handleSwipe('nope');
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

  // Handle Notification button
  const handleNotificationPress = () => {
    logEvent(Events.NOTIFICATION_PRESSED, {
      unreadCount: notificationCount,
    });
    
    // TODO: Navigate to notifications/matches screen
    console.log('Navigate to notifications');
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

  if (!currentProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Typography variant="h2" color="primary" style={styles.emptyTitle}>
            {t('common.loading')}
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Loading State */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Loader size="large" />
          <Typography variant="body" style={styles.loadingText}>
            {t('discovery.loading')}
          </Typography>
        </View>
      )}

      {/* Main Content */}
      {!isLoading && currentProfile ? (
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
              sports: currentProfile.preferred_sports?.map((sport, index) => ({
                id: `sport_${index}`,
                name: sport,
                icon: getSportIcon(sport),
              })) || [],
              location: '', // TODO: Add location field to ProfileRow
              distanceInKm: (currentProfile as ProfileWithDistance).distanceInKm, // Pass distance info
            }}
            onSwipeLeft={handleNope}
            onSwipeRight={handleChallenge}
            style={styles.swipeCard}
          />
        </Animated.View>
      ) : !isLoading && !hasProfiles ? (
        <EmptyState
          icon="people-outline"
          title={t('discovery.noMoreProfiles')}
          description={t('discovery.tryAdjustingFilters')}
          actionLabel={t('discovery.refreshProfiles')}
          onAction={refreshProfiles}
          style={styles.emptyState}
        />
      ) : null}

      {/* Match Modal */}
      <MatchModal
        visible={showMatchModal}
        currentUser={currentUser}
        matchedUser={matchedProfile ? {
          id: matchedProfile.id,
          email: '', // TODO: Add email field to ProfileRow
          firstName: matchedProfile.full_name?.split(' ')[0] || 'Unknown',
          lastName: matchedProfile.full_name?.split(' ').slice(1).join(' ') || '',
          age: matchedProfile.date_of_birth ? 
            new Date().getFullYear() - new Date(matchedProfile.date_of_birth).getFullYear() : 
            25,
          gender: matchedProfile.gender === 'man' ? 'male' : 'female',
          bio: '', // TODO: Add bio field to ProfileRow
          photos: matchedProfile.avatar_urls || [],
          location: {
            latitude: 0, // TODO: Add location fields to ProfileRow
            longitude: 0,
            city: 'City',
            country: 'Country'
          },
          sports: matchedProfile.preferred_sports?.map(sport => ({
            name: sport,
            skillLevel: 'intermediate' as const,
            yearsPlaying: 2
          })) || [],
          preferences: {
            ageRange: [18, 35] as [number, number],
            maxDistance: 25,
            genderPreference: 'both' as const,
            sportsInterests: matchedProfile.preferred_sports || []
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
      />

      {/* Top Corner Buttons Overlay - Positioned last for proper layering */}
      <FilterButton
        onPress={handleFilterPress}
        active={activeFilters > 0}
        badgeCount={activeFilters}
        style={styles.topLeftButton}
      />
      
      <NotificationButton
        badgeCount={notificationCount}
        onPress={handleNotificationPress}
        style={styles.topRightButton}
      />

      {/* Bottom Action Buttons Overlay - Stationary when SwipeCard moves */}
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
});
