import React, { useCallback } from 'react';
import { View, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../../components/atoms/Typography';
import { Button } from '../../../components/atoms/Button';
import { DistanceRangeSelector } from '../../../components/atoms/DistanceRangeSelector';
import { AgeRangeSelector } from '../../../components/atoms/AgeRangeSelector';
import { theme } from '../../../theme';
import { t } from '../../../shared/utils/i18n';
import { logEvent } from '../../../shared/utils/analytics';
import { useDiscoverFiltersStore } from './useDiscoverFiltersStore';
import { SportFilterChipsGroup } from '../../../components/business/SportFilterChipsGroup';

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
}) => {
  const {
    distance,
    ageRange,
    gender,
    sports,
    setDistance,
    setAgeRange,
    setGender,
    setSports,
    resetFilters,
    applyFilters,
  } = useDiscoverFiltersStore();

  const handleDistanceChange = useCallback((newDistance: number) => {
    setDistance(newDistance);
  }, [setDistance]);

  const handleAgeRangeChange = useCallback((newRange: [number, number]) => {
    setAgeRange(newRange);
  }, [setAgeRange]);

  const handleGenderChange = useCallback((newGender: 'men' | 'women' | 'any') => {
    setGender(newGender);
  }, [setGender]);

  const handleReset = useCallback(() => {
    resetFilters();
    logEvent('FilterModal_ResetFilters_Clicked');
  }, [resetFilters]);

  const handleApply = useCallback(() => {
    applyFilters();
    logEvent('FilterModal_ApplyFilters_Clicked');
    onClose();
  }, [applyFilters, onClose]);

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
              gender === option && styles.genderButtonActive
            ]}
            onPress={() => handleGenderChange(option)}
          >
            <Typography
              variant="button"
              color={gender === option ? 'primary' : 'secondary'}
              weight={gender === option ? 'bold' : 'normal'}
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
          onChange={setSports}
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
          {/* Distance Selector */}
          <View style={styles.sectionContainer}>
            <DistanceRangeSelector
              value={distance}
              onChange={handleDistanceChange}
              min={1}
              max={100}
              step={1}
            />
          </View>

          {/* Age Range Selector */}
          <View style={styles.sectionContainer}>
            <AgeRangeSelector
              value={ageRange}
              onChange={handleAgeRangeChange}
              min={18}
              max={70}
              step={1}
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
