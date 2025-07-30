import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { InputFieldProps } from './InputField.types';
import { styles } from './InputField.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const InputField: React.FC<InputFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  variant = 'default',
  label,
  errorText,
  helperText,
  leftIcon,
  rightIcon,
  iconFamily = 'Ionicons',
  onRightIconPress,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  autoCapitalize = 'sentences',
  autoCorrect = true,
  keyboardType = 'default',
  secureTextEntry,
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    logEvent(Events.INPUT_FOCUSED, { variant, label });
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleChangeText = (text: string) => {
    onChangeText(text);
    logEvent(Events.INPUT_CHANGED, { variant, label, textLength: text.length });
  };

  const getIconComponent = (iconName: string, isRight = false) => {
    const iconSize = 20;
    const iconColor = theme.colors.text.secondary;
    
    const iconProps = {
      name: iconName as any,
      size: iconSize,
      color: iconColor,
      style: isRight ? styles.rightIcon : styles.leftIcon,
    };

    switch (iconFamily) {
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons {...iconProps} />;
      case 'MaterialIcons':
        return <MaterialIcons {...iconProps} />;
      default:
        return <Ionicons {...iconProps} />;
    }
  };

  const getKeyboardType = () => {
    if (variant === 'numeric') return 'numeric';
    if (variant === 'password') return 'default';
    return keyboardType;
  };

  const getSecureTextEntry = () => {
    if (variant === 'password') return !isPasswordVisible;
    return secureTextEntry;
  };

  const handlePasswordToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
    logEvent(Events.PASSWORD_VISIBILITY_TOGGLED, { visible: !isPasswordVisible });
  };

  const getRightIcon = () => {
    if (variant === 'password') {
      return isPasswordVisible ? 'eye-off' : 'eye';
    }
    return rightIcon;
  };

  const handleRightIconPress = () => {
    if (variant === 'password') {
      handlePasswordToggle();
    } else {
      onRightIconPress?.();
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          errorText && styles.inputContainerError,
          disabled && styles.inputContainerDisabled,
        ]}
      >
        {leftIcon && getIconComponent(leftIcon)}
        
        <TextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline,
          ]}
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.tertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          keyboardType={getKeyboardType()}
          secureTextEntry={getSecureTextEntry()}
        />
        
        {getRightIcon() && (
          <Pressable onPress={handleRightIconPress}>
            {getIconComponent(getRightIcon()!, true)}
          </Pressable>
        )}
      </View>
      
      {errorText && <Text style={styles.errorText}>{errorText}</Text>}
      {helperText && !errorText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};
