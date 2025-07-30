import React from 'react';
import { TouchableOpacity, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Typography } from '../Typography';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const getButtonStyle = (
  variant: ButtonProps['variant'],
  size: ButtonProps['size'],
  disabled: boolean,
  fullWidth: boolean
): ViewStyle => {
  const baseStyle: ViewStyle = {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...(fullWidth && { width: '100%' }),
  };

  const sizeStyles: Record<string, ViewStyle> = {
    sm: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 36,
    },
    md: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      minHeight: 44,
    },
    lg: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
      minHeight: 52,
    },
  };

  const variantStyles: Record<string, ViewStyle> = {
    primary: {
      backgroundColor: disabled ? theme.colors.secondary[300] : theme.colors.primary.main,
      ...theme.shadows.sm,
    },
    secondary: {
      backgroundColor: disabled ? theme.colors.secondary[200] : theme.colors.secondary.main,
      ...theme.shadows.sm,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: disabled ? theme.colors.border.secondary : theme.colors.primary.main,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
  };

  return {
    ...baseStyle,
    ...sizeStyles[size || 'md'],
    ...variantStyles[variant || 'primary'],
  };
};

const getTextColor = (variant: ButtonProps['variant'], disabled: boolean): string => {
  if (disabled) {
    return theme.colors.text.tertiary;
  }

  switch (variant) {
    case 'primary':
      return theme.colors.text.inverse;
    case 'secondary':
      return theme.colors.text.primary;
    case 'outline':
      return theme.colors.primary.main;
    case 'ghost':
      return theme.colors.primary.main;
    default:
      return theme.colors.text.inverse;
  }
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onPress,
  children,
  style,
  textStyle,
  testID,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    
    logEvent(Events.SCREEN_VIEWED, {
      action: 'button_pressed',
      variant,
      size,
    });
    
    onPress();
  };

  const buttonStyle = getButtonStyle(variant, size, disabled || loading, fullWidth);
  const textColor = getTextColor(variant, disabled || loading);

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={textColor}
          style={{ marginRight: theme.spacing.sm }}
        />
      ) : null}
      <Typography
        variant="button"
        color={textColor}
        style={textStyle}
      >
        {children}
      </Typography>
    </TouchableOpacity>
  );
};
