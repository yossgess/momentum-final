import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';

import {
  Typography,
  InputField,
  DateTimePicker,
  SectionSelector,
  Button,
  Tag,
  Loader,
} from '../../../components';
import { SportChip } from '../../../components/business/SportChip';
import { PhotoSelector } from '../../../components/atoms/PhotoSelector';
import { PhotoData } from '../../../components/atoms/PhotoSelector/PhotoSelector.types';

import { useOnboardingStore } from '../../onboarding/store/onboardingStore';
import { useAuthStore } from '../../../shared/stores/authStore';
import { t } from '../../../shared/utils/i18n';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { theme } from '../../../theme';
import { categorizedSports, allSports } from '../../../constants/sports';

const DAYS_OF_WEEK = [
  { key: 'monday', label: t('onboarding.form.monday') },
  { key: 'tuesday', label: t('onboarding.form.tuesday') },
  { key: 'wednesday', label: t('onboarding.form.wednesday') },
  { key: 'thursday', label: t('onboarding.form.thursday') },
  { key: 'friday', label: t('onboarding.form.friday') },
  { key: 'saturday', label: t('onboarding.form.saturday') },
  { key: 'sunday', label: t('onboarding.form.sunday') },
];

const TIME_PERIODS = [
  { key: 'morning', label: t('onboarding.form.morning') },
  { key: 'afternoon', label: t('onboarding.form.afternoon') },
  { key: 'evening', label: t('onboarding.form.evening') },
];

const GENDER_OPTIONS = [
  { text: t('onboarding.form.man'), value: 'man' },
  { text: t('onboarding.form.woman'), value: 'woman' },
];

const INTEREST_OPTIONS = [
  { text: t('onboarding.form.men'), value: 'men' },
  { text: t('onboarding.form.women'), value: 'women' },
  { text: t('onboarding.form.any'), value: 'any' },
];

export const OnboardingForm: React.FC = () => {
  const navigation = useNavigation();
  const { completeOnboarding } = useAuthStore();
  const {
    formData,
    currentStep,
    totalSteps,
    updateFormData,
    nextStep,
    previousStep,
    setLoading,
    setError,
    prefillFromSocialAuth,
  } = useOnboardingStore();

  const [selectedSportsCategory, setSelectedSportsCategory] = useState(0);
  const [selectedDays, setSelectedDays] = useState<string[]>(formData.availability.days);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>(formData.availability.periods);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('No authenticated user');

      const uploadedPhotoUrls: string[] = [];
      for (const photo of data.photos) {
        const fileName = `avatar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
        try {
          const { storageService } = await import('../../../shared/services/storageService');
          const publicUrl = await storageService.uploadAvatar(user.id, photo.uri, fileName);
          uploadedPhotoUrls.push(publicUrl);
        } catch (error) {
          console.warn('Failed to upload photo:', error);
          uploadedPhotoUrls.push(photo.uri);
        }
      }

      const updatedFormData = {
        ...data,
        photos: uploadedPhotoUrls.map((url, index) => ({ uri: url, id: `uploaded_${index}` })),
      };

      const { profilesService } = await import('../../../shared/services/profilesService');
      await profilesService.createProfile(user.id, updatedFormData);
      
      return { success: true };
    },
    onSuccess: () => {
      completeOnboarding();
    },
    onError: (error: any) => {
      logEvent(Events.SIGNUP_FAILED, { error: error.message });
      setError(t('onboarding.form.error.submitFailed'));
      Alert.alert(
        'Error',
        t('onboarding.form.error.submitFailed'),
        [{ text: 'OK' }]
      );
    },
  });

  useEffect(() => {
    logEvent(Events.ONBOARDING_STARTED);
    // Prefill from social auth if available (mock)
    prefillFromSocialAuth('', undefined);
  }, []);

  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 0:
        if (!formData.fullName || formData.fullName.length < 2) {
          errors.fullName = t('onboarding.form.error.minLength');
        }
        if (!formData.dateOfBirth) {
          errors.dateOfBirth = t('onboarding.form.error.invalidDate');
        } else {
          const age = new Date().getFullYear() - formData.dateOfBirth.getFullYear();
          if (age < 18) {
            errors.dateOfBirth = t('onboarding.form.error.minAge');
          }
        }
        if (!formData.gender) {
          errors.gender = t('onboarding.form.error.selectGender');
        }
        if (!formData.interestedIn) {
          errors.interestedIn = t('onboarding.form.error.selectInterest');
        }
        break;
      case 1:
        if (formData.preferredSports.length === 0) {
          errors.preferredSports = t('onboarding.form.error.selectSports');
        }
        break;
      case 2:
        if (selectedDays.length === 0 || selectedPeriods.length === 0) {
          errors.availability = t('onboarding.form.error.selectAvailability');
        }
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      logEvent(Events.ONBOARDING_NEXT, { step: currentStep });
      nextStep();
    }
  };

  const handleBack = () => {
    previousStep();
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      setLoading(true);
      logEvent(Events.ONBOARDING_FORM_SUBMITTED);
      submitMutation.mutate(formData);
    }
  };

  const handleGenderSelect = (index: number) => {
    const gender = index === 0 ? 'man' : 'woman';
    updateFormData({ gender });
    logEvent(Events.ONBOARDING_FORM_FIELD_UPDATED, { field: 'gender', value: gender });
  };

  const handleInterestSelect = (index: number) => {
    const interests = ['men', 'women', 'any'] as const;
    const interestedIn = interests[index];
    updateFormData({ interestedIn });
    logEvent(Events.ONBOARDING_FORM_FIELD_UPDATED, { field: 'interestedIn', value: interestedIn });
  };

  const handleSportsCategoryChange = (index: number) => {
    setSelectedSportsCategory(index);
    logEvent(Events.SECTION_SELECTED, { category: Object.keys(categorizedSports)[index] });
  };

  const handleSportToggle = (sportName: string) => {
    const newSports = formData.preferredSports.includes(sportName)
      ? formData.preferredSports.filter(s => s !== sportName)
      : [...formData.preferredSports, sportName];
    
    updateFormData({ preferredSports: newSports });
    
    logEvent(formData.preferredSports.includes(sportName) ? Events.SPORT_DESELECTED : Events.SPORT_SELECTED, {
      sport: sportName,
    });
  };

  const handleDayToggle = (day: string) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    
    setSelectedDays(newDays);
    updateFormData({ availability: { ...formData.availability, days: newDays } });
    logEvent(Events.ONBOARDING_FORM_FIELD_UPDATED, { field: 'availabilityDays', value: newDays.join(',') });
  };

  const handlePeriodToggle = (period: string) => {
    const newPeriods = selectedPeriods.includes(period)
      ? selectedPeriods.filter(p => p !== period)
      : [...selectedPeriods, period];
    
    setSelectedPeriods(newPeriods);
    updateFormData({ availability: { ...formData.availability, periods: newPeriods } });
    logEvent(Events.ONBOARDING_FORM_FIELD_UPDATED, { field: 'availabilityPeriods', value: newPeriods.join(',') });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={{ gap: theme.spacing.xl, paddingHorizontal: theme.spacing.sm }}>
            <View>
              <InputField
                label={t('onboarding.form.fullName')}
                placeholder={t('onboarding.form.fullNamePlaceholder')}
                value={formData.fullName}
                onChangeText={(text) => {
                  updateFormData({ fullName: text });
                  logEvent(Events.ONBOARDING_FORM_FIELD_UPDATED, { field: 'fullName' });
                }}
                errorText={formErrors.fullName}
              />
            </View>

            <View>
              <Typography variant="body" style={{ marginBottom: theme.spacing.sm }}>
                {t('onboarding.form.dateOfBirth')}
              </Typography>
              <DateTimePicker
                value={formData.dateOfBirth || undefined}
                onChange={(date) => {
                  updateFormData({ dateOfBirth: date });
                  logEvent(Events.ONBOARDING_FORM_FIELD_UPDATED, { field: 'dateOfBirth' });
                }}
                mode="date"
                maximumDate={new Date()}
              />
              {formErrors.dateOfBirth && (
                <Typography variant="caption" style={{ color: '#FF6B6B', marginTop: theme.spacing.xs }}>
                  {formErrors.dateOfBirth}
                </Typography>
              )}
            </View>

            <View>
              <Typography variant="body" style={{ marginBottom: theme.spacing.sm }}>
                {t('onboarding.form.gender')}
              </Typography>
              <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
                {GENDER_OPTIONS.map((option, index) => (
                  <Button
                    key={option.value}
                    label={option.text}
                    variant={formData.gender === option.value ? 'primary' : 'secondary'}
                    onPress={() => handleGenderSelect(index)}
                    style={{ flex: 1 }}
                  />
                ))}
              </View>
              {formErrors.gender && (
                <Typography variant="caption" style={{ color: '#FF6B6B', marginTop: theme.spacing.xs }}>
                  {formErrors.gender}
                </Typography>
              )}
            </View>

            <View>
              <Typography variant="body" style={{ marginBottom: theme.spacing.sm }}>
                {t('onboarding.form.interestedIn')}
              </Typography>
              <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
                {INTEREST_OPTIONS.map((option, index) => (
                  <Button
                    key={option.value}
                    label={option.text}
                    variant={formData.interestedIn === option.value ? 'primary' : 'secondary'}
                    onPress={() => handleInterestSelect(index)}
                    style={{ flex: 1 }}
                  />
                ))}
              </View>
              {formErrors.interestedIn && (
                <Typography variant="caption" style={{ color: '#FF6B6B', marginTop: theme.spacing.xs }}>
                  {formErrors.interestedIn}
                </Typography>
              )}
            </View>
          </View>
        );

      case 1:
        const categoryNames = Object.keys(categorizedSports);
        const selectedCategoryName = categoryNames[selectedSportsCategory];
        const sportsInCategory = categorizedSports[selectedCategoryName] || [];

        return (
          <View style={{ gap: theme.spacing.lg }}>
            <Typography variant="h3">{t('onboarding.form.preferredSports')}</Typography>
            
            <SectionSelector
              sections={categoryNames.map(cat => t(`sports.categories.${cat}`))}
              selectedIndex={selectedSportsCategory}
              onSelectionChange={handleSportsCategoryChange}
            />

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
              {sportsInCategory.map((sportName) => {
                const sport = allSports.find(s => s.name === sportName);
                if (!sport) return null;
                
                const isSelected = formData.preferredSports.includes(sportName);
                return (
                  <SportChip
                    key={sport.id}
                    sport={sport}
                    selected={isSelected}
                    onPress={() => handleSportToggle(sportName)}
                    variant={isSelected ? 'filled' : 'outlined'}
                    size="md"
                  />
                );
              })}
            </View>

            {formErrors.preferredSports && (
              <Typography variant="caption" style={{ color: '#FF6B6B' }}>
                {formErrors.preferredSports}
              </Typography>
            )}
          </View>
        );

      case 2:
        return (
          <View style={{ gap: theme.spacing.lg }}>
            <Typography variant="h3">{t('onboarding.form.availability')}</Typography>
            
            <View>
              <Typography variant="body" style={{ marginBottom: theme.spacing.sm }}>
                {t('onboarding.form.days')}
              </Typography>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
                {DAYS_OF_WEEK.map(({ key, label }) => {
                  const isSelected = selectedDays.includes(key);
                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => handleDayToggle(key)}
                    >
                      <Tag
                        label={label}
                        variant={isSelected ? 'filled' : 'outlined'}
                        onPress={() => handleDayToggle(key)}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View>
              <Typography variant="body" style={{ marginBottom: theme.spacing.sm }}>
                {t('onboarding.form.periods')}
              </Typography>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
                {TIME_PERIODS.map(({ key, label }) => {
                  const isSelected = selectedPeriods.includes(key);
                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => handlePeriodToggle(key)}
                    >
                      <Tag
                        label={label}
                        variant={isSelected ? 'filled' : 'outlined'}
                        onPress={() => handlePeriodToggle(key)}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {formErrors.availability && (
              <Typography variant="caption" style={{ color: '#FF6B6B' }}>
                {formErrors.availability}
              </Typography>
            )}
            
            <View>
              <Typography variant="h3" style={{ marginBottom: theme.spacing.sm }}>
                {t('onboarding.form.photos.label')}
              </Typography>
              <Typography variant="body" style={{ marginBottom: theme.spacing.md, color: theme.colors.text.secondary }}>
                {t('onboarding.form.photos.description')}
              </Typography>
              
              <PhotoSelector
                photos={formData.photos}
                mainPhotoIndex={formData.mainPhotoIndex}
                onPhotosChange={(photos: PhotoData[]) => {
                  updateFormData({ photos });
                  logEvent(Events.ONBOARDING_FORM_FIELD_UPDATED, { field: 'photos', value: photos.length });
                }}
                onMainPhotoChange={(index: number) => {
                  updateFormData({ mainPhotoIndex: index });
                  logEvent(Events.ONBOARDING_FORM_FIELD_UPDATED, { field: 'mainPhotoIndex', value: index });
                }}
                maxImages={5}
              />
              
              {formErrors.photos && (
                <Typography variant="caption" style={{ color: '#FF6B6B', marginTop: theme.spacing.sm }}>
                  {formErrors.photos}
                </Typography>
              )}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: theme.spacing.lg,
          paddingBottom: theme.spacing.xl * 2,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: theme.spacing.xl }}>
          <Typography variant="h1" style={{ textAlign: 'center', marginBottom: theme.spacing.sm }}>
            {t('onboarding.form.title')}
          </Typography>
          <Typography variant="body" style={{ textAlign: 'center', opacity: 0.7 }}>
            {t('onboarding.form.subtitle')}
          </Typography>
          
          {/* Progress Indicator */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center',
            marginTop: theme.spacing.lg,
            gap: theme.spacing.xs,
          }}>
            <Typography variant="caption">
              {t('onboarding.form.step')} {currentStep + 1} {t('onboarding.form.of')} {totalSteps}
            </Typography>
          </View>
          
          {/* Progress Bar */}
          <View style={{
            height: 4,
            backgroundColor: theme.colors.surface.primary,
            borderRadius: 2,
            marginTop: theme.spacing.sm,
          }}>
            <View style={{
              height: '100%',
              width: `${((currentStep + 1) / totalSteps) * 100}%`,
              backgroundColor: theme.colors.primary.main,
              borderRadius: 2,
            }} />
          </View>
        </View>

        {/* Form Content */}
        {renderStep()}

        {/* Navigation Buttons */}
        <View style={{
          flexDirection: 'row',
          gap: theme.spacing.md,
          marginTop: theme.spacing.xl,
        }}>
          {currentStep > 0 && (
            <Button
              label={t('onboarding.form.back')}
              variant="secondary"
              onPress={handleBack}
            />
          )}
          
          <Button
            label={isLastStep ? t('onboarding.form.finish') : t('onboarding.form.continue')}
            onPress={isLastStep ? handleSubmit : handleNext}
            loading={submitMutation.isPending}
            variant="primary"
          />
        </View>

        {/* Loading Overlay */}
        {submitMutation.isPending && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              backgroundColor: theme.colors.surface.primary,
              padding: theme.spacing.lg,
              borderRadius: theme.spacing.md,
              alignItems: 'center',
            }}>
              <Loader size="large" />
              <Typography variant="body" style={{ marginTop: theme.spacing.md }}>
                {t('onboarding.form.submitting')}
              </Typography>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
