import React from 'react';
import { View } from 'react-native';
import { InputField } from '../../atoms/InputField';
import { Typography } from '../../atoms/Typography';
import { FormFieldProps } from './FormField.types';
import { styles } from './FormField.styles';

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  variant = 'default',
  errorText,
  helperText,
  required = false,
  disabled = false,
  leftIcon,
  rightIcon,
  iconFamily,
  onRightIconPress,
  multiline,
  numberOfLines,
  maxLength,
  autoCapitalize,
  autoCorrect,
  keyboardType,
  secureTextEntry,
  onFocus,
  onBlur,
  style,
}) => {
  const displayLabel = required && label ? `${label} *` : label;

  return (
    <View style={[styles.container, style]}>
      <InputField
        label={displayLabel}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        variant={variant}
        errorText={errorText}
        helperText={helperText}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        iconFamily={iconFamily}
        onRightIconPress={onRightIconPress}
        disabled={disabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </View>
  );
};
