import React, { useState } from 'react';
import { TextInput, View, ViewStyle, TextStyle } from 'react-native';
import { Typography } from '../Typography';
import { theme } from '../../../theme';

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  testID?: string;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  style,
  inputStyle,
  testID,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle: ViewStyle = {
    marginBottom: theme.spacing.md,
    ...style,
  };

  const inputContainerStyle: ViewStyle = {
    borderWidth: 1,
    borderColor: error 
      ? theme.colors.status.error 
      : isFocused 
        ? theme.colors.primary.main 
        : theme.colors.border.primary,
    borderRadius: theme.borderRadius.md,
    backgroundColor: disabled ? theme.colors.surface.secondary : theme.colors.surface.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: multiline ? theme.spacing.md : theme.spacing.sm,
    minHeight: multiline ? 80 : 44,
  };

  const textInputStyle: TextStyle = {
    fontSize: theme.typography.fontSize.base,
    color: disabled ? theme.colors.text.tertiary : theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.regular,
    flex: 1,
    textAlignVertical: multiline ? 'top' : 'center',
    ...inputStyle,
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Typography
          variant="caption"
          color="secondary"
          style={{ marginBottom: theme.spacing.xs }}
        >
          {label}
        </Typography>
      )}
      
      <View style={inputContainerStyle}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.tertiary}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={textInputStyle}
          testID={testID}
        />
      </View>
      
      {error && (
        <Typography
          variant="caption"
          color={theme.colors.status.error}
          style={{ marginTop: theme.spacing.xs }}
        >
          {error}
        </Typography>
      )}
    </View>
  );
};
