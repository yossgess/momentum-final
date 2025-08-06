import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../../components/atoms/Typography';
import { Button } from '../../../components/atoms/Button';
import { DistanceSlider, AgeRangeSlider } from '../../../components/molecules/FilterSlider';
import { theme } from '../../../theme';
import { t } from '../../../shared/utils/i18n';
import { logEvent } from '../../../shared/utils/analytics';
import { useDiscoverFiltersStore } from './useDiscoverFiltersStore';
import { SportFilterChipsGroup } from '../../../components/business/SportFilterChipsGroup';

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onFiltersApplied?: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onFiltersApplied,
}) => {
  const {
    distanceKm,
    ageRange,
    interestedIn,
    sports,
    setDistance,
    setAgeRange,
    setInterestedIn,
    setSports,
    resetFilters,
    applyFilters,
    loadFilterPreferences,
  } = useDiscoverFiltersStore();

  const handleDistanceChange = useCallback(async (newDistance: number) => {
    try {
      await setDistance(newDistance);
    } catch (error) {
      console.error('Failed to save distance preference:', error);
    }
  }, [setDistance]);

  const handleAgeRangeChange = useCallback(async (newRange: [number, number]) => {
    try {
      await setAgeRange(newRange);
    } catch (error) {
      console.error('Failed to save age range preference:', error);
    }
  }, [setAgeRange]);

  const handleInterestedInChange = useCallback(async (newInterestedIn: 'men' | 'women' | 'any') => {
    try {
      await setInterestedIn(newInterestedIn);
    } catch (error) {
      console.error('Failed to save interested in preference:', error);
    }
  }, [setInterestedIn]);

  const handleSportsChange = useCallback(async (newSports: string[]) => {
    try {
      await setSports(newSports);
    } catch (error) {
      console.error('Failed to save sports preference:', error);
    }
  }, [setSports]);

  const handleReset = useCallback(() => {
    resetFilters();
    logEvent('FilterModal_ResetFilters_Clicked');
  }, [resetFilters]);

  const handleApply = useCallback(async () => {
    try {
      await applyFilters();
      onClose();
      logEvent('FilterModal_ApplyFilters_Clicked');
      
      // Refresh profiles after applying filters
      onFiltersApplied?.();
    } catch (error) {
      console.error('Failed to apply filters:', error);
    }
  }, [applyFilters, onClose, onFiltersApplied]);

  useEffect(() => {
    if (visible) {
      loadFilterPreferences().catch(error => {
        console.error('Failed to load filter preferences:', error);
      });
    }
  }, [visible, loadFilterPreferences]);

  const renderGenderSelector = () => (
    <View style={styles.sectionContainer}>
      <Typography 
        variant="body" 
        color="primary" 
        weight="bold" 
        style={styles.sectionLabel}
      >
        {t('filters.gender')}
      </Typography>
      
      <View style={styles.genderContainer}>
        {(['men', 'women', 'any'] as const).map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.genderButton,
              interestedIn === option && styles.genderButtonActive
            ]}
            onPress={() => handleInterestedInChange(option)}
          >
            <Typography
              variant="button"
              color={interestedIn === option ? 'primary' : 'secondary'}
              weight={interestedIn === option ? 'bold' : 'normal'}
            >
              {t(`filters.${option}`)}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSportsSelector = () => (
    <View style={styles.sectionContainer}>
      <Typography 
        variant="body" 
        color="primary" 
        weight="bold" 
        style={styles.sectionLabel}
      >
        {t('filters.sports')}
      </Typography>
      
      <View style={styles.sportsContainer}>
        <SportFilterChipsGroup
          selectedFilters={sports}
          onChange={handleSportsChange}
          showClearAll={true}
          showSelectAll={false}
        />
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h3" color="primary" weight="bold">
            {t('filters.title')}
          </Typography>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Distance Slider - New stable component */}
          <View style={styles.sectionContainer}>
            <Typography 
              variant="body" 
              color="primary" 
              weight="bold" 
              style={styles.sectionLabel}
            >
              {t('filters.distance')}
            </Typography>
            <DistanceSlider
              value={distanceKm}
              onValueChange={handleDistanceChange}
              min={10}
              max={100}
              step={1}
              unit="km"
              testID="filter-distance-slider"
            />
          </View>

          {/* Age Range Slider - New stable component */}
          <View style={styles.sectionContainer}>
            <Typography 
              variant="body" 
              color="primary" 
              weight="bold" 
              style={styles.sectionLabel}
            >
              {t('filters.ageRange')}
            </Typography>
            <AgeRangeSlider
              values={ageRange}
              onValuesChange={handleAgeRangeChange}
              min={18}
              max={65}
              step={1}
              unit="years"
              testID="filter-age-range-slider"
            />
          </View>

          {/* Gender Selector */}
          {renderGenderSelector()}

          {/* Sports Selector */}
          {renderSportsSelector()}
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <Button
            variant="secondary"
            onPress={handleReset}
            style={styles.resetButton}
          >
            {t('filters.reset')}
          </Button>
          
          <Button
            variant="primary"
            onPress={handleApply}
            style={styles.applyButton}
          >
            {t('filters.apply')}
          </Button>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.secondary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionContainer: {
    marginVertical: theme.spacing.lg,
  },
  sectionLabel: {
    marginBottom: theme.spacing.sm,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  genderButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.surface.secondary,
    backgroundColor: theme.colors.surface.primary,
    alignItems: 'center',
  },
  genderButtonActive: {
    borderColor: theme.colors.primary.main,
    backgroundColor: theme.colors.primary.light,
  },
  sportsContainer: {
    alignItems: 'center',
  },
  selectorSpacing: {
    marginBottom: theme.spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface.secondary,
    gap: theme.spacing.md,
  },
  resetButton: {
    flex: 1,
  },
  applyButton: {
    flex: 2,
  },
});
