import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { MatchModal } from './index';
import { Typography } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';
import { theme } from '../../../theme';
import { UserProfile } from '../../../shared/stores/userStore';
import { mockProfiles } from '../../../features/discovery/mockProfiles';

// Convert mock profile to UserProfile format
const convertMockToUserProfile = (mock: any, index: number): UserProfile => ({
  id: mock.id,
  email: `${mock.name.toLowerCase()}@example.com`,
  firstName: mock.name,
  lastName: 'User',
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

// Create test profiles from mock data
const testProfiles = mockProfiles.map(convertMockToUserProfile);

// Test scenarios with actual mock profile data
const testScenarios = [
  {
    title: 'Sofia & David - Multiple Shared Sports',
    description: 'Both users love Padel and Tennis',
    currentUser: {
      ...testProfiles[0], // Sofia
      firstName: 'Sofia',
      sports: [
        { name: 'Padel', skillLevel: 'intermediate' as const, yearsPlaying: 3 },
        { name: 'Yoga', skillLevel: 'advanced' as const, yearsPlaying: 5 },
        { name: 'Tennis', skillLevel: 'beginner' as const, yearsPlaying: 1 },
      ]
    },
    matchedUser: {
      ...testProfiles[1], // David
      firstName: 'David',
      sports: [
        { name: 'Padel', skillLevel: 'advanced' as const, yearsPlaying: 4 },
        { name: 'Tennis', skillLevel: 'expert' as const, yearsPlaying: 8 },
        { name: 'Basketball', skillLevel: 'intermediate' as const, yearsPlaying: 6 },
      ]
    }
  },
  {
    title: 'Emma & Marcus - Single Shared Sport',
    description: 'Both users play Soccer',
    currentUser: {
      ...testProfiles[2], // Emma
      firstName: 'Emma',
      sports: [
        { name: 'Swimming', skillLevel: 'advanced' as const, yearsPlaying: 6 },
        { name: 'Volleyball', skillLevel: 'intermediate' as const, yearsPlaying: 4 },
        { name: 'Soccer', skillLevel: 'beginner' as const, yearsPlaying: 1 },
      ]
    },
    matchedUser: {
      ...testProfiles[3], // Marcus
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
    description: 'Different sports interests',
    currentUser: {
      ...testProfiles[4], // Aria
      firstName: 'Aria',
      sports: [
        { name: 'Dance', skillLevel: 'expert' as const, yearsPlaying: 8 },
        { name: 'Pilates', skillLevel: 'advanced' as const, yearsPlaying: 4 },
        { name: 'Rock Climbing', skillLevel: 'intermediate' as const, yearsPlaying: 2 },
      ]
    },
    matchedUser: {
      ...testProfiles[0], // Sofia
      firstName: 'Sofia',
      sports: [
        { name: 'Padel', skillLevel: 'intermediate' as const, yearsPlaying: 3 },
        { name: 'Yoga', skillLevel: 'advanced' as const, yearsPlaying: 5 },
        { name: 'Tennis', skillLevel: 'beginner' as const, yearsPlaying: 1 },
      ]
    }
  }
];

export const MatchModalDemoWithMocks: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<number | null>(null);

  const handleSendMessage = () => {
    console.log('Send message clicked');
    setCurrentScenario(null);
  };

  const handleKeepSwiping = () => {
    console.log('Keep swiping clicked');
    setCurrentScenario(null);
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
        paddingTop: theme.spacing['2xl'],
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
        Test the new immersive MatchModal with real mock profile data:
        {'\n'}
        ⚡ Lightning bolt animations
        {'\n'}
        👤 Names under avatars
        {'\n'}
        🏆 Shared sports detection
        {'\n'}
        📱 Haptic feedback
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
              marginBottom: theme.spacing.xs,
            }}
          >
            {scenario.title}
          </Typography>

          <Typography
            variant="body"
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing.md,
            }}
          >
            {scenario.description}
          </Typography>

          {/* User Profiles Preview */}
          <View
            style={{
              flexDirection: 'row',
              marginBottom: theme.spacing.md,
              gap: theme.spacing.md,
            }}
          >
            {/* Current User */}
            <View style={{ flex: 1 }}>
              <Typography
                variant="body"
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.primary.light,
                  marginBottom: theme.spacing.xs,
                }}
              >
                {scenario.currentUser.firstName} ({scenario.currentUser.age})
              </Typography>
              <Typography
                variant="body"
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.xs,
                }}
              >
                Photos: {scenario.currentUser.photos.length}
              </Typography>
              <Typography
                variant="body"
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.tertiary,
                }}
              >
                {scenario.currentUser.sports.map(s => s.name).join(', ')}
              </Typography>
            </View>

            {/* VS */}
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: theme.spacing.sm,
              }}
            >
              <Typography
                variant="body"
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.primary.main,
                  fontWeight: theme.typography.fontWeight.bold,
                }}
              >
                VS
              </Typography>
            </View>

            {/* Matched User */}
            <View style={{ flex: 1 }}>
              <Typography
                variant="body"
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.primary.light,
                  marginBottom: theme.spacing.xs,
                }}
              >
                {scenario.matchedUser.firstName} ({scenario.matchedUser.age})
              </Typography>
              <Typography
                variant="body"
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.xs,
                }}
              >
                Photos: {scenario.matchedUser.photos.length}
              </Typography>
              <Typography
                variant="body"
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.tertiary,
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
              🎯 Test This Match
            </Typography>
          </Button>
        </View>
      ))}

      {/* Info Box */}
      <View
        style={{
          backgroundColor: theme.colors.primary.dark,
          padding: theme.spacing.md,
          borderRadius: theme.borderRadius.lg,
          marginTop: theme.spacing.lg,
        }}
      >
        <Typography
          variant="body"
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.primary,
            textAlign: 'center',
            lineHeight: theme.typography.lineHeight.relaxed,
          }}
        >
          💡 This demo uses actual mock profile data with real images, names, and sports.
          {'\n'}
          The MatchModal will show shared sports dynamically and use proper user information.
        </Typography>
      </View>

      {/* Render the MatchModal for the current scenario */}
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
