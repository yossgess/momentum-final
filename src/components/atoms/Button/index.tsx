import React from 'react';
import { TouchableOpacity, ViewStyle, TextStyle, ActivityIndicator, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Typography } from '../Typography';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'iconButton';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onPress: () => void;
  children?: React.ReactNode;
  label?: string;
  icon?: string;
  iconFamily?: 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons';
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
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: disabled ? theme.colors.secondary[300] : theme.colors.secondary.main,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: disabled ? theme.colors.border.secondary : theme.colors.primary.main,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    danger: {
      backgroundColor: disabled ? theme.colors.secondary[300] : theme.colors.status.error,
    },
    iconButton: {
      backgroundColor: 'transparent',
      width: size === 'sm' ? 32 : size === 'lg' ? 48 : 40,
      height: size === 'sm' ? 32 : size === 'lg' ? 48 : 40,
      borderRadius: (size === 'sm' ? 32 : size === 'lg' ? 48 : 40) / 2,
      paddingHorizontal: 0,
      paddingVertical: 0,
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
      return theme.colors.text.primary;
    case 'secondary':
      return theme.colors.secondary.main;
    case 'outline':
      return theme.colors.primary.main;
    case 'ghost':
      return theme.colors.primary.main;
    case 'danger':
      return theme.colors.text.primary;
    case 'iconButton':
      return theme.colors.text.primary;
    default:
      return theme.colors.text.primary;
  }
};

const getIconComponent = (iconName: string, iconFamily: string, size: number, color: string) => {
  const iconProps = { name: iconName as any, size, color };
  
  switch (iconFamily) {
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons {...iconProps} />;
    case 'MaterialIcons':
      return <MaterialIcons {...iconProps} />;
    default:
      return <Ionicons {...iconProps} />;
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
  label,
  icon,
  iconFamily = 'Ionicons',
  style,
  textStyle,
  testID,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    
    logEvent(Events.BUTTON_PRESSED, {
      variant,
      size,
      label: label || 'button',
    });
    
    onPress();
  };

  const buttonStyle = getButtonStyle(variant, size, disabled || loading, fullWidth);
  const textColor = getTextColor(variant, disabled || loading);
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
  
  const content = children || label;
  const isIconOnly = variant === 'iconButton' || (icon && !content);

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
          style={!isIconOnly ? { marginRight: theme.spacing.sm } : undefined}
        />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {icon && getIconComponent(icon, iconFamily, iconSize, textColor)}
          {content && (
            <Typography
              variant="button"
              color={textColor}
              style={[
                textStyle,
                icon && !isIconOnly && { marginLeft: theme.spacing.sm }
              ] as any}
            >
              {content}
            </Typography>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};
