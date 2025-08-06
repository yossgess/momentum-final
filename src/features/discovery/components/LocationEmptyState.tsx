import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../../components/atoms/Typography';
import { Button } from '../../../components/atoms/Button';
import { theme } from '../../../theme';
import { t } from '../../../shared/utils/i18n';
import { logEvent } from '../../../shared/utils/analytics';
import { locationService } from '../../../shared/services/locationService';

export interface LocationEmptyStateProps {
  onLocationUpdated?: () => void;
}

export const LocationEmptyState: React.FC<LocationEmptyStateProps> = ({
  onLocationUpdated,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnableLocation = async () => {
    setIsLoading(true);
    
    try {
      logEvent('location_enable_button_pressed', {});
      
      const success = await locationService.requestLocationAndUpdate();
      
      if (success) {
        Alert.alert(
          t('discovery.location.success.title'),
          t('discovery.location.success.message'),
          [
            {
              text: t('common.ok'),
              onPress: () => {
                logEvent('location_enabled_successfully', {});
                onLocationUpdated?.();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          t('discovery.location.error.title'),
          t('discovery.location.error.message'),
          [
            {
              text: t('common.tryAgain'),
              onPress: handleEnableLocation,
            },
            {
              text: t('common.cancel'),
              style: 'cancel',
            },
          ]
        );
      }
    } catch (error) {
      console.error('Failed to enable location:', error);
      
      Alert.alert(
        t('discovery.location.error.title'),
        t('discovery.location.error.message'),
        [
          {
            text: t('common.tryAgain'),
            onPress: handleEnableLocation,
          },
          {
            text: t('common.cancel'),
            style: 'cancel',
          },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name="location-outline" 
          size={80} 
          color={theme.colors.text.secondary} 
        />
      </View>
      
      <Typography 
        variant="h2" 
        color="primary" 
        weight="bold" 
        style={styles.title}
      >
        {t('discovery.location.title')}
      </Typography>
      
      <Typography 
        variant="body" 
        color="secondary" 
        style={styles.description}
      >
        {t('discovery.location.description')}
      </Typography>
      
      <View style={styles.reasonsContainer}>
        <View style={styles.reasonItem}>
          <Ionicons 
            name="people-outline" 
            size={24} 
            color={theme.colors.primary.main} 
          />
          <Typography 
            variant="body" 
            color="primary" 
            style={styles.reasonText}
          >
            {t('discovery.location.reason1')}
          </Typography>
        </View>
        
        <View style={styles.reasonItem}>
          <Ionicons 
            name="map-outline" 
            size={24} 
            color={theme.colors.primary.main} 
          />
          <Typography 
            variant="body" 
            color="primary" 
            style={styles.reasonText}
          >
            {t('discovery.location.reason2')}
          </Typography>
        </View>
        
        <View style={styles.reasonItem}>
          <Ionicons 
            name="shield-checkmark-outline" 
            size={24} 
            color={theme.colors.primary.main} 
          />
          <Typography 
            variant="body" 
            color="primary" 
            style={styles.reasonText}
          >
            {t('discovery.location.reason3')}
          </Typography>
        </View>
      </View>
      
      <Button
        variant="primary"
        onPress={handleEnableLocation}
        loading={isLoading}
        style={styles.enableButton}
        testID="enable-location-button"
      >
        {t('discovery.location.enableButton')}
      </Button>
      
      <Typography 
        variant="caption" 
        color="secondary" 
        style={styles.privacyNote}
      >
        {t('discovery.location.privacyNote')}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  iconContainer: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  description: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
  },
  reasonsContainer: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  reasonText: {
    marginLeft: theme.spacing.md,
    flex: 1,
    lineHeight: 20,
  },
  enableButton: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  privacyNote: {
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: theme.spacing.md,
  },
});
