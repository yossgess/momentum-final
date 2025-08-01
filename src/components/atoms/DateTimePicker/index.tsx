import React, { useState } from 'react';
import { View, Text, Pressable, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../Typography';
import { DateTimePickerProps } from './DateTimePicker.types';
import { styles } from './DateTimePicker.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { t } from '../../../shared/utils/i18n';

export const DateTimePickerComponent: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  mode = 'date',
  label,
  placeholder,
  disabled = false,
  minimumDate,
  maximumDate,
  style,
}) => {
  const [show, setShow] = useState(false);

  const handlePress = () => {
    if (disabled) return;
    setShow(true);
    logEvent(Events.DATE_TIME_SELECTED, { mode });
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatValue = (date: Date) => {
    if (mode === 'date') {
      return date.toLocaleDateString();
    } else if (mode === 'time') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleString();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <Pressable
        style={[
          styles.inputContainer,
          disabled && styles.inputContainerDisabled,
        ]}
        onPress={handlePress}
        disabled={disabled}
      >
        <Text style={[
          styles.text,
          !value && styles.placeholder,
          disabled && styles.textDisabled,
        ]}>
          {value ? formatValue(value) : placeholder || t('common.selectDateTime')}
        </Text>
        
        <Ionicons
          name={mode === 'time' ? 'time-outline' : 'calendar-outline'}
          size={20}
          color={disabled ? theme.colors.text.tertiary : theme.colors.text.secondary}
        />
      </Pressable>

      {Platform.OS === 'ios' ? (
        <Modal
          visible={show}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShow(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Pressable onPress={() => setShow(false)}>
                  <Typography variant="body" color={theme.colors.primary.main}>
                    {t('common.cancel')}
                  </Typography>
                </Pressable>
                <Typography variant="h4" color="primary">
                  {label || t('common.selectDate')}
                </Typography>
                <Pressable onPress={() => setShow(false)}>
                  <Typography variant="body" color={theme.colors.primary.main}>
                    {t('common.done')}
                  </Typography>
                </Pressable>
              </View>
              <DateTimePicker
                testID="dateTimePicker"
                value={value || new Date()}
                mode={mode}
                is24Hour={true}
                display="spinner"
                onChange={handleChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                themeVariant="dark"
                textColor={theme.colors.text.primary}
                accentColor={theme.colors.primary.main}
              />
            </View>
          </View>
        </Modal>
      ) : (
        show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={value || new Date()}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={handleChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            themeVariant="dark"
            textColor={theme.colors.text.primary}
            accentColor={theme.colors.primary.main}
          />
        )
      )}
    </View>
  );
};
