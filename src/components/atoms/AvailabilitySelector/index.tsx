import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Typography } from '../Typography';
import { theme } from '../../../theme';
import { t } from '../../../shared/utils/i18n';
import { logEvent, Events } from '../../../shared/utils/analytics';

// Inline types to avoid import issues
export interface AvailabilityData {
  days: string[];
  periods: string[];
  slots?: string[]; // Individual slot selections like ["monday-morning", "tuesday-evening"]
}

export interface AvailabilitySelectorProps {
  availability: AvailabilityData;
  onChange?: (availability: AvailabilityData) => void;
  mode?: 'edit' | 'display';
  testID?: string;
}

// Inline styles to avoid import issues
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },

  headerRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },

  dayHeaderCell: {
    width: 80,
    height: 32,
  },

  periodHeaderCell: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerText: {
    color: theme.colors.text.secondary,
    fontWeight: '600',
    textAlign: 'center',
  },

  dayRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
  },

  dayLabelCell: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    paddingRight: theme.spacing.sm,
  },

  dayLabel: {
    color: theme.colors.text.primary,
    fontWeight: '500',
  },

  slotCell: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  slot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface.secondary,
    borderWidth: 2,
    borderColor: theme.colors.border.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  slotSelected: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },

  slotDisplayMode: {
    opacity: 0.8,
  },

  slotIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  slotIndicatorFilled: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.surface.primary,
  },

  modeIndicator: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.secondary,
    alignItems: 'center',
  },

  modeIndicatorText: {
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
});

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

export const AvailabilitySelector: React.FC<AvailabilitySelectorProps> = ({
  availability,
  onChange,
  mode = 'edit',
  testID,
}) => {
  const isEditMode = mode === 'edit';

  // Helper function to get selected slots - prioritize slots array if available
  const getSelectedSlots = (): string[] => {
    // If we have individual slots, use them directly
    if (availability.slots && availability.slots.length > 0) {
      return availability.slots;
    }
    
    // Fallback: if we only have days/periods arrays (legacy format), 
    // assume they represent individual slots, not all combinations
    const slots: string[] = [];
    
    // For backward compatibility, if we have equal number of days and periods,
    // pair them up as individual slots
    if (availability.days.length === availability.periods.length) {
      for (let i = 0; i < availability.days.length; i++) {
        slots.push(`${availability.days[i]}-${availability.periods[i]}`);
      }
    }
    
    return slots;
  };

  // Helper function to convert slots back to availability format
  const slotsToAvailability = (slots: string[]): AvailabilityData => {
    const days = new Set<string>();
    const periods = new Set<string>();
    
    slots.forEach(slot => {
      const [day, period] = slot.split('-');
      if (day && period) {
        days.add(day);
        periods.add(period);
      }
    });
    
    return {
      days: Array.from(days),
      periods: Array.from(periods),
      slots: slots, // Store individual slots for precise selection
    };
  };

  const isSlotSelected = (day: string, period: string): boolean => {
    const selectedSlots = getSelectedSlots();
    return selectedSlots.includes(`${day}-${period}`);
  };

  const handleSlotToggle = (day: string, period: string) => {
    if (!isEditMode || !onChange) return;

    const slotKey = `${day}-${period}`;
    const selectedSlots = getSelectedSlots();
    const isCurrentlySelected = selectedSlots.includes(slotKey);

    let newSlots: string[];
    if (isCurrentlySelected) {
      // Remove the specific slot
      newSlots = selectedSlots.filter(slot => slot !== slotKey);
    } else {
      // Add the specific slot
      newSlots = [...selectedSlots, slotKey];
    }

    const newAvailability = slotsToAvailability(newSlots);
    onChange(newAvailability);

    // Analytics logging
    logEvent(Events.ONBOARDING_FORM_FIELD_UPDATED, {
      field: 'availability',
      day,
      period,
      action: isCurrentlySelected ? 'removed' : 'added',
      totalSlots: newSlots.length,
    });
  };

  const renderSlot = (day: string, period: string) => {
    const isSelected = isSlotSelected(day, period);
    const slotStyle = [
      styles.slot,
      isSelected && styles.slotSelected,
      !isEditMode && styles.slotDisplayMode,
    ];

    const SlotComponent = isEditMode ? TouchableOpacity : View;

    return (
      <SlotComponent
        key={`${day}-${period}`}
        style={slotStyle}
        onPress={isEditMode ? () => handleSlotToggle(day, period) : undefined}
        testID={`${testID}-slot-${day}-${period}`}
      >
        <View style={styles.slotIndicator}>
          {isSelected && <View style={styles.slotIndicatorFilled} />}
        </View>
      </SlotComponent>
    );
  };

  return (
    <View style={styles.container} testID={testID}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.dayHeaderCell} />
        {TIME_PERIODS.map(({ key, label }) => (
          <View key={key} style={styles.periodHeaderCell}>
            <Typography variant="caption" style={styles.headerText}>
              {label}
            </Typography>
          </View>
        ))}
      </View>

      {/* Days Rows */}
      {DAYS_OF_WEEK.map(({ key: dayKey, label: dayLabel }) => (
        <View key={dayKey} style={styles.dayRow}>
          <View style={styles.dayLabelCell}>
            <Typography variant="body" style={styles.dayLabel}>
              {dayLabel}
            </Typography>
          </View>
          {TIME_PERIODS.map(({ key: periodKey }) => (
            <View key={periodKey} style={styles.slotCell}>
              {renderSlot(dayKey, periodKey)}
            </View>
          ))}
        </View>
      ))}

      {/* Mode Indicator */}
      {!isEditMode && (
        <View style={styles.modeIndicator}>
          <Typography variant="caption" style={styles.modeIndicatorText}>
            {t('availability.displayMode')}
          </Typography>
        </View>
      )}
    </View>
  );
};
