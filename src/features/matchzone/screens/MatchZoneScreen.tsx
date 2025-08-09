import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  Alert,
  TouchableOpacity,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { 
  getUserMatches, 
  getMatchNotifications,
  markMatchNotificationsAsSeen,
  createTestMatches,
  cleanupTestData,
  MatchWithDetails,
  MatchNotification
} from '../../../shared/services/matchingService';
import { Typography } from '../../../components/atoms/Typography';
import { Button } from '../../../components/atoms/Button';
import { Loader } from '../../../components/atoms/Loader';
import { t } from '../../../shared/utils/i18n';

export const MatchZoneScreen: React.FC = () => {
  // Screen view analytics
  useEffect(() => {
    logEvent(Events.SCREEN_VIEWED, { screenName: 'Arena' });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.emptyArenaContainer}>
        <Typography variant="h4" style={styles.emptyArenaTitle}>
          {t('arena.title')}
        </Typography>
        <Typography variant="body" style={styles.emptyArenaMessage}>
          {t('arena.comingSoon')}
        </Typography>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  errorTitle: {
    color: '#FF6B6B',
    marginBottom: theme.spacing.sm,
  },
  errorMessage: {
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    paddingHorizontal: theme.spacing.xl,
  },
  retryButtonText: {
    color: theme.colors.text.primary,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
  },
  notificationBanner: {
    backgroundColor: theme.colors.primary.light,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  notificationText: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
  },
  devTools: {
    backgroundColor: theme.colors.surface.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  devToolsTitle: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  devButtonsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  devButton: {
    flex: 1,
  },
  devButtonText: {
    fontSize: theme.typography.fontSize.sm,
  },
  sectionTitle: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  matchesList: {
    marginBottom: theme.spacing.lg,
  },
  matchCard: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  avatarContainer: {
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
  },
  matchDetails: {
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  commonSports: {
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  matchDate: {
    color: theme.colors.text.tertiary,
  },
  arrowContainer: {
    marginLeft: theme.spacing.sm,
  },
  arrow: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize['2xl'],
  },
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing['2xl'],
  },
  emptyTitle: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  emptyMessage: {
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  createMatchesButton: {
    paddingHorizontal: theme.spacing.xl,
  },
  createMatchesButtonText: {
    color: theme.colors.text.primary,
  },
  emptyArenaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyArenaTitle: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.bold,
  },
  emptyArenaMessage: {
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
