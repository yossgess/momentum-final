import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Components
import { Typography } from '../../../components/atoms/Typography';
import { IconBadge } from '../../../components/atoms/IconBadge';
import { FilterButton } from '../../../components/molecules/FilterButton';
import { NotificationButton } from '../../../components/atoms/NotificationButton';
import { SwipeCard } from '../../../components/business/SwipeCard';
import { ImageCarousel } from '../../../components/business/ImageCarousel';
import { FiltersChipGroup } from '../../../components/business/FiltersChipGroup';
import { ChallengeButton } from '../../../components/business/ChallengeButton';
import { NopeButton } from '../../../components/business/NopeButton';
import { RevertButton } from '../../../components/business/RevertButton';
import { MatchModal } from '../../../components/business/MatchModal';

// Utils & Types
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { t } from '../../../shared/utils/i18n';
import { mockProfiles, MockProfile } from '../mockProfiles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const DiscoveryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  
  // State management
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [profiles] = useState<MockProfile[]>(mockProfiles);
  const [skippedProfiles, setSkippedProfiles] = useState<MockProfile[]>([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<MockProfile | null>(null);
  const [hasNewMatches, setHasNewMatches] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  // Animation refs
  const cardAnimatedValue = useRef(new Animated.Value(0)).current;

  const currentProfile = profiles[currentProfileIndex];

  // Mock current user for MatchModal
  const currentUser = {
    id: 'current_user',
    name: 'You',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=600&fit=crop'
  };

  useEffect(() => {
    logEvent(Events.SCREEN_VIEWED, { screenName: 'Discovery' });
  }, []);

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

    logEvent(Events.PROFILE_SWIPED_RIGHT, { 
      profileId: currentProfile.id,
      profileName: currentProfile.name,
      action: 'challenge'
    });

    // Simulate mutual challenge (50% chance for demo)
    const isMutualChallenge = Math.random() > 0.5;
    
    if (isMutualChallenge) {
      setMatchedProfile(currentProfile);
      setShowMatchModal(true);
      setHasNewMatches(true);
      logEvent(Events.MATCH_CREATED, { 
        profileId: currentProfile.id,
        profileName: currentProfile.name 
      });
    }

    // Move to next profile
    animateCardTransition('up');
    setTimeout(() => {
      setCurrentProfileIndex(prev => (prev + 1) % profiles.length);
    }, 150);
  };

  // Handle Nope action
  const handleNope = () => {
    if (!currentProfile) return;

    logEvent(Events.PROFILE_SWIPED_LEFT, { 
      profileId: currentProfile.id,
      profileName: currentProfile.name,
      action: 'nope'
    });

    // Add to skipped profiles
    setSkippedProfiles(prev => [currentProfile, ...prev]);

    // Move to next profile
    animateCardTransition('up');
    setTimeout(() => {
      setCurrentProfileIndex(prev => (prev + 1) % profiles.length);
    }, 150);
  };

  // Handle Revert action
  const handleRevert = () => {
    if (skippedProfiles.length === 0) return;

    const lastSkippedProfile = skippedProfiles[0];
    
    logEvent(Events.PROFILE_VIEWED, { 
      profileId: lastSkippedProfile.id,
      profileName: lastSkippedProfile.name,
      action: 'revert'
    });

    // Remove from skipped profiles
    setSkippedProfiles(prev => prev.slice(1));
    
    // Find the profile in the main list and go back to it
    const profileIndex = profiles.findIndex(p => p.id === lastSkippedProfile.id);
    if (profileIndex !== -1) {
      animateCardTransition('down');
      setTimeout(() => {
        setCurrentProfileIndex(profileIndex);
      }, 150);
    }
  };

  // Handle Filter button
  const handleFilterPress = () => {
    logEvent(Events.BUTTON_PRESSED, { buttonType: 'filter', screenName: 'Discovery' });
    // TODO: Navigate to filters screen
  };

  // Handle Notification button
  const handleNotificationPress = () => {
    logEvent(Events.NOTIFICATION_PRESSED, { screenName: 'Discovery' });
    // TODO: Navigate to notifications/matches screen
  };

  // Handle Match Modal actions
  const handleSendMessage = () => {
    if (!matchedProfile) return;
    
    logEvent(Events.MESSAGE_SENT, { 
      profileId: matchedProfile.id,
      profileName: matchedProfile.name,
      source: 'match_modal'
    });
    
    setShowMatchModal(false);
    // TODO: Navigate to chat screen
  };

  const handleKeepSwiping = () => {
    setShowMatchModal(false);
  };

  const handleCloseModal = () => {
    setShowMatchModal(false);
  };

  const handleContinueDiscovery = () => {
    logEvent(Events.MODAL_CLOSED, { modalType: 'match' });
    setShowMatchModal(false);
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
      {/* Enhanced SwipeCard - Full Screen */}
      <Animated.View 
        style={[
          styles.swipeCardContainer,
          {
            transform: [{ translateY: cardAnimatedValue }],
          }
        ]}
      >
        <SwipeCard
          profile={{
            id: currentProfile.id,
            name: currentProfile.name,
            age: currentProfile.age,
            images: currentProfile.images,
            location: `${currentProfile.distance} ${t('discover.distance')}`,
            bio: currentProfile.bio,
            sports: currentProfile.sports.map((sportName, index) => ({
              id: `sport_${index}`,
              name: sportName,
              icon: 'fitness',
            })),
          }}
          onSwipeLeft={handleNope}
          onSwipeRight={handleChallenge}
          onPressImage={(imageIndex) => {
            logEvent(Events.PROFILE_VIEWED, { profileId: currentProfile.id, imageIndex });
          }}
          fullScreen={true}
          style={styles.swipeCard}
        />
      </Animated.View>

      {/* Match Modal */}
      <MatchModal
        visible={showMatchModal}
        currentUser={currentUser}
        matchedUser={matchedProfile ? {
          id: matchedProfile.id,
          name: matchedProfile.name,
          image: matchedProfile.images[0]
        } : currentUser}
        onSendMessage={handleSendMessage}
        onKeepSwiping={handleKeepSwiping}
        onClose={handleCloseModal}
      />

      {/* Top Corner Buttons Overlay - Positioned last for proper layering */}
      <FilterButton
        onPress={handleFilterPress}
        active={activeFilters > 0}
        badgeCount={activeFilters}
        style={styles.topLeftButton}
      />
      
      <NotificationButton
        badgeCount={hasNewMatches ? 1 : 0}
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
          onPress={handleRevert}
          disabled={skippedProfiles.length === 0}
          size="lg"
          style={styles.actionButton}
        />
        <ChallengeButton
          onPress={handleChallenge}
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
  },
});
