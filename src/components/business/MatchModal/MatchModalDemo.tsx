import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { MatchModal } from './index';
import { Typography } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';
import { theme } from '../../../theme';
import { UserProfile } from '../../../shared/stores/userStore';

// Mock user data for testing
const mockCurrentUser: UserProfile = {
  id: '1',
  email: 'sofia@example.com',
  firstName: 'Sofia',
  lastName: 'Martinez',
  age: 26,
  gender: 'female',
  bio: 'Passionate about padel and yoga. Love staying active!',
  photos: [
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
  ],
  location: {
    latitude: 40.7128,
    longitude: -74.0060,
    city: 'New York',
    country: 'USA',
  },
  sports: [
    { name: 'Padel', skillLevel: 'intermediate', yearsPlaying: 3 },
    { name: 'Yoga', skillLevel: 'advanced', yearsPlaying: 5 },
    { name: 'Tennis', skillLevel: 'beginner', yearsPlaying: 1 },
  ],
  preferences: {
    ageRange: [22, 35],
    maxDistance: 25,
    genderPreference: 'both',
    sportsInterests: ['Padel', 'Tennis', 'Yoga'],
  },
};

const mockMatchedUser: UserProfile = {
  id: '2',
  email: 'david@example.com',
  firstName: 'David',
  lastName: 'Chen',
  age: 29,
  gender: 'male',
  bio: 'Tennis enthusiast and padel lover. Always up for a game!',
  photos: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
  ],
  location: {
    latitude: 40.7589,
    longitude: -73.9851,
    city: 'New York',
    country: 'USA',
  },
  sports: [
    { name: 'Padel', skillLevel: 'advanced', yearsPlaying: 4 },
    { name: 'Tennis', skillLevel: 'expert', yearsPlaying: 8 },
    { name: 'Yoga', skillLevel: 'beginner', yearsPlaying: 1 },
  ],
  preferences: {
    ageRange: [23, 32],
    maxDistance: 30,
    genderPreference: 'both',
    sportsInterests: ['Padel', 'Tennis', 'Basketball'],
  },
};

export const MatchModalDemo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSendMessage = () => {
    console.log('Send message clicked');
    setIsVisible(false);
    // In real app, navigate to chat screen
  };

  const handleKeepSwiping = () => {
    console.log('Keep swiping clicked');
    setIsVisible(false);
    // In real app, continue discovery flow
  };

  const handleClose = () => {
    console.log('Modal closed');
    setIsVisible(false);
  };

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
          marginBottom: theme.spacing.lg,
        }}
      >
        MatchModal Demo
      </Typography>

      <Typography
        variant="body"
        style={{
          fontSize: theme.typography.fontSize.base,
          color: theme.colors.text.secondary,
          textAlign: 'center',
          marginBottom: theme.spacing['2xl'],
          lineHeight: theme.typography.lineHeight.relaxed,
        }}
      >
        Test the new immersive MatchModal with advanced animations, haptics, and beautiful UI.
        {'\n\n'}
        Features: Lightning bolt animation, avatar scaling, haptic feedback, shared sports display, and smooth transitions.
      </Typography>

      <Button
        variant="primary"
        onPress={() => setIsVisible(true)}
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
          Show Match Modal
        </Typography>
      </Button>

      <MatchModal
        visible={isVisible}
        currentUser={mockCurrentUser}
        matchedUser={mockMatchedUser}
        onSendMessage={handleSendMessage}
        onKeepSwiping={handleKeepSwiping}
        onClose={handleClose}
      />
    </View>
  );
};
