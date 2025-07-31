import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { MatchModal } from './index';
import { Typography } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';
import { theme } from '../../../theme';
import { UserProfile } from '../../../shared/stores/userStore';
import { mockProfiles } from '../../../features/discovery/mockProfiles';

// Convert mock profiles to UserProfile format
const convertMockToUserProfile = (mock: any, index: number): UserProfile => ({
  id: mock.id,
  email: `${mock.name.toLowerCase()}@example.com`,
  firstName: mock.name,
  lastName: 'Test',
  age: mock.age,
  gender: index % 2 === 0 ? 'female' : 'male',
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

// Create test profiles
const testProfiles = mockProfiles.map(convertMockToUserProfile);

// Test scenarios with different shared sports
const testScenarios = [
  {
    title: 'Sofia & David - Multiple Shared Sports',
    currentUser: {
      ...testProfiles[0],
      sports: [
        { name: 'Padel', skillLevel: 'intermediate' as const, yearsPlaying: 3 },
        { name: 'Yoga', skillLevel: 'advanced' as const, yearsPlaying: 5 },
        { name: 'Tennis', skillLevel: 'beginner' as const, yearsPlaying: 1 },
      ]
    },
    matchedUser: {
      ...testProfiles[1],
      firstName: 'David',
      sports: [
        { name: 'Padel', skillLevel: 'advanced' as const, yearsPlaying: 4 },
        { name: 'Tennis', skillLevel: 'expert' as const, yearsPlaying: 8 },
        { name: 'Basketball', skillLevel: 'intermediate' as const, yearsPlaying: 6 },
      ]
    }
  },
  {
    title: 'Emma & Marcus - One Shared Sport',
    currentUser: {
      ...testProfiles[2],
      firstName: 'Emma',
      sports: [
        { name: 'Swimming', skillLevel: 'advanced' as const, yearsPlaying: 6 },
        { name: 'Volleyball', skillLevel: 'intermediate' as const, yearsPlaying: 4 },
        { name: 'Soccer', skillLevel: 'beginner' as const, yearsPlaying: 1 },
      ]
    },
    matchedUser: {
      ...testProfiles[3],
      firstName: 'Marcus',
      sports: [
        { name: 'Soccer', skillLevel: 'expert' as const, yearsPlaying: 10 },
        { name: 'Boxing', skillLevel: 'advanced' as const, yearsPlaying: 5 },
        { name: 'Cycling', skillLevel: 'intermediate' as const, yearsPlaying: 3 },
      ]
    }
  },
  {
    title: 'Aria & Sofia - No Shared Sports',
    currentUser: {
      ...testProfiles[4],
      firstName: 'Aria',
      sports: [
        { name: 'Dance', skillLevel: 'expert' as const, yearsPlaying: 8 },
        { name: 'Pilates', skillLevel: 'advanced' as const, yearsPlaying: 4 },
        { name: 'Rock Climbing', skillLevel: 'intermediate' as const, yearsPlaying: 2 },
      ]
    },
    matchedUser: {
      ...testProfiles[0],
      firstName: 'Sofia',
      sports: [
        { name: 'Padel', skillLevel: 'intermediate' as const, yearsPlaying: 3 },
        { name: 'Yoga', skillLevel: 'advanced' as const, yearsPlaying: 5 },
        { name: 'Tennis', skillLevel: 'beginner' as const, yearsPlaying: 1 },
      ]
    }
  }
];

export const MatchModalTest: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<number | null>(null);

  const handleSendMessage = () => {
    console.log('Send message clicked');
    setCurrentScenario(null);
    // In real app, navigate to chat screen
  };

  const handleKeepSwiping = () => {
    console.log('Keep swiping clicked');
    setCurrentScenario(null);
    // In real app, continue discovery flow
  };

  const handleClose = () => {
    console.log('Modal closed');
    setCurrentScenario(null);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background.primary,
      }}
      contentContainerStyle={{
        padding: theme.spacing.lg,
        paddingTop: theme.spacing['3xl'],
      }}
    >
      <Typography
        variant="h1"
        style={{
          fontSize: theme.typography.fontSize['3xl'],
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.text.primary,
          textAlign: 'center',
          marginBottom: theme.spacing.md,
        }}
      >
        MatchModal Test Suite
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
        Test the new immersive MatchModal with different scenarios:
        {'\n'}
        • Multiple shared sports
        {'\n'}
        • Single shared sport
        {'\n'}
        • No shared sports
      </Typography>

      {testScenarios.map((scenario, index) => (
        <View
          key={index}
          style={{
            marginBottom: theme.spacing.lg,
            padding: theme.spacing.md,
            backgroundColor: theme.colors.surface.primary,
            borderRadius: theme.borderRadius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
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
            {scenario.title}
          </Typography>

          <View
            style={{
              flexDirection: 'row',
              marginBottom: theme.spacing.md,
            }}
          >
            <View style={{ flex: 1 }}>
              <Typography
                variant="body"
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.xs,
                }}
              >
                {scenario.currentUser.firstName}'s Sports:
              </Typography>
              <Typography
                variant="body"
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.primary.light,
                }}
              >
                {scenario.currentUser.sports.map(s => s.name).join(', ')}
              </Typography>
            </View>

            <View style={{ flex: 1 }}>
              <Typography
                variant="body"
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.xs,
                }}
              >
                {scenario.matchedUser.firstName}'s Sports:
              </Typography>
              <Typography
                variant="body"
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.primary.light,
                }}
              >
                {scenario.matchedUser.sports.map(s => s.name).join(', ')}
              </Typography>
            </View>
          </View>

          <Button
            variant="primary"
            onPress={() => setCurrentScenario(index)}
            style={{
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.borderRadius.md,
            }}
          >
            <Typography
              variant="button"
              style={{
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.text.primary,
              }}
            >
              Test This Match
            </Typography>
          </Button>
        </View>
      ))}

      {/* Render the modal for the current scenario */}
      {currentScenario !== null && (
        <MatchModal
          visible={true}
          currentUser={testScenarios[currentScenario].currentUser}
          matchedUser={testScenarios[currentScenario].matchedUser}
          onSendMessage={handleSendMessage}
          onKeepSwiping={handleKeepSwiping}
          onClose={handleClose}
        />
      )}
    </ScrollView>
  );
};
