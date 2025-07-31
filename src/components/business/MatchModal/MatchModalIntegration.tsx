import React, { useState } from 'react';
import { View } from 'react-native';
import { MatchModal } from './index';
import { Typography } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';
import { theme } from '../../../theme';
import { useUserStore } from '../../../shared/stores/userStore';
import { UserProfile } from '../../../shared/stores/userStore';
import { mockProfiles } from '../../../features/discovery/mockProfiles';

/**
 * Example integration showing how to properly pass the current user's actual profile
 * from the userStore to the MatchModal component in a real discovery flow.
 */

// Convert mock profile to UserProfile format for demonstration
const convertMockToUserProfile = (mock: any): UserProfile => ({
  id: mock.id,
  email: `${mock.name.toLowerCase()}@example.com`,
  firstName: mock.name,
  lastName: 'User',
  age: mock.age,
  gender: mock.id === 'p001' || mock.id === 'p003' || mock.id === 'p005' ? 'female' : 'male',
  bio: mock.bio || 'Sports enthusiast looking for active partners!',
  photos: mock.images,
  location: {
    latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
    longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
    city: mock.location || 'New York',
    country: 'USA',
  },
  sports: mock.sports.map((sport: string) => ({
    name: sport,
    skillLevel: ['beginner', 'intermediate', 'advanced', 'expert'][Math.floor(Math.random() * 4)] as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    yearsPlaying: Math.floor(Math.random() * 10) + 1,
  })),
  preferences: {
    ageRange: [18, 40] as [number, number],
    maxDistance: 25,
    genderPreference: 'both',
    sportsInterests: mock.sports,
  },
});

export const MatchModalIntegration: React.FC = () => {
  const { profile: currentUserProfile } = useUserStore();
  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);

  // Simulate a match occurring
  const simulateMatch = () => {
    // In a real app, this would come from your discovery/matching logic
    const randomMockProfile = mockProfiles[Math.floor(Math.random() * mockProfiles.length)];
    const convertedMatchedUser = convertMockToUserProfile(randomMockProfile);
    
    setMatchedUser(convertedMatchedUser);
    setMatchModalVisible(true);
  };

  const handleSendMessage = () => {
    console.log('Navigating to chat with:', matchedUser?.firstName);
    setMatchModalVisible(false);
    // In real app: navigate to chat screen
    // navigation.navigate('Chat', { userId: matchedUser.id });
  };

  const handleKeepSwiping = () => {
    console.log('Continuing discovery flow');
    setMatchModalVisible(false);
    // In real app: continue showing more profiles
  };

  const handleCloseMatch = () => {
    console.log('Match modal closed');
    setMatchModalVisible(false);
  };

  // Show loading state if current user profile is not loaded
  if (!currentUserProfile) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background.primary,
          justifyContent: 'center',
          alignItems: 'center',
          padding: theme.spacing.lg,
        }}
      >
        <Typography
          variant="body"
          style={{
            fontSize: theme.typography.fontSize.lg,
            color: theme.colors.text.secondary,
            textAlign: 'center',
          }}
        >
          Loading user profile...
        </Typography>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background.primary,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
      }}
    >
      <Typography
        variant="h1"
        style={{
          fontSize: theme.typography.fontSize['2xl'],
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.text.primary,
          textAlign: 'center',
          marginBottom: theme.spacing.md,
        }}
      >
        MatchModal Integration
      </Typography>

      <Typography
        variant="body"
        style={{
          fontSize: theme.typography.fontSize.base,
          color: theme.colors.text.secondary,
          textAlign: 'center',
          marginBottom: theme.spacing.lg,
          lineHeight: theme.typography.lineHeight.relaxed,
        }}
      >
        This demonstrates how to properly integrate the MatchModal
        {'\n'}
        with the actual current user profile from userStore.
      </Typography>

      {/* Current User Info Display */}
      <View
        style={{
          backgroundColor: theme.colors.surface.primary,
          padding: theme.spacing.md,
          borderRadius: theme.borderRadius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
          marginBottom: theme.spacing.lg,
          width: '100%',
        }}
      >
        <Typography
          variant="h3"
          style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Current User Profile:
        </Typography>

        <Typography
          variant="body"
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.xs,
          }}
        >
          Name: {currentUserProfile.firstName} {currentUserProfile.lastName}
        </Typography>

        <Typography
          variant="body"
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.xs,
          }}
        >
          Age: {currentUserProfile.age}
        </Typography>

        <Typography
          variant="body"
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.xs,
          }}
        >
          Photos: {currentUserProfile.photos.length} uploaded
        </Typography>

        <Typography
          variant="body"
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.primary.light,
          }}
        >
          Sports: {currentUserProfile.sports.map(s => s.name).join(', ')}
        </Typography>
      </View>

      <Button
        variant="primary"
        onPress={simulateMatch}
        style={{
          paddingHorizontal: theme.spacing['2xl'],
          paddingVertical: theme.spacing.md,
          borderRadius: theme.borderRadius.lg,
        }}
      >
        <Typography
          variant="button"
          style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
          }}
        >
          Simulate Match
        </Typography>
      </Button>

      {/* MatchModal with ACTUAL current user profile */}
      {matchedUser && (
        <MatchModal
          visible={matchModalVisible}
          currentUser={currentUserProfile} // ✅ ACTUAL current user from userStore
          matchedUser={matchedUser}        // ✅ Matched user from discovery logic
          onSendMessage={handleSendMessage}
          onKeepSwiping={handleKeepSwiping}
          onClose={handleCloseMatch}
        />
      )}
    </View>
  );
};

/**
 * INTEGRATION NOTES FOR PRODUCTION:
 * 
 * 1. USER PROFILE SOURCE:
 *    - Always use `useUserStore().profile` for currentUser
 *    - Never use mock data for currentUser in production
 *    - Ensure user profile is loaded before showing MatchModal
 * 
 * 2. MATCHED USER SOURCE:
 *    - Get from your discovery/matching API response
 *    - Convert API response to UserProfile format if needed
 *    - Ensure matched user has all required fields (photos, sports, etc.)
 * 
 * 3. NAVIGATION INTEGRATION:
 *    - onSendMessage: Navigate to chat screen with matched user
 *    - onKeepSwiping: Continue discovery flow
 *    - onClose: Handle modal dismissal (analytics, cleanup, etc.)
 * 
 * 4. ERROR HANDLING:
 *    - Check if currentUserProfile exists before showing modal
 *    - Handle cases where user photos or sports are empty
 *    - Graceful fallbacks for missing data
 * 
 * For integration example, see DiscoveryScreen implementation.
 */
