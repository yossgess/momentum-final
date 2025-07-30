import React from 'react';
import { Text, TextStyle } from 'react-native';
import { theme } from '../../../theme';

export interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'button';
  color?: keyof typeof theme.colors.text | string;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  children: React.ReactNode;
  style?: TextStyle;
  numberOfLines?: number;
}

const getVariantStyle = (variant: TypographyProps['variant']): TextStyle => {
  switch (variant) {
    case 'h1':
      return {
        fontSize: theme.typography.fontSize['4xl'],
        lineHeight: theme.typography.fontSize['4xl'] * theme.typography.lineHeight.tight,
        fontWeight: theme.typography.fontWeight.bold,
      };
    case 'h2':
      return {
        fontSize: theme.typography.fontSize['3xl'],
        lineHeight: theme.typography.fontSize['3xl'] * theme.typography.lineHeight.tight,
        fontWeight: theme.typography.fontWeight.bold,
      };
    case 'h3':
      return {
        fontSize: theme.typography.fontSize['2xl'],
        lineHeight: theme.typography.fontSize['2xl'] * theme.typography.lineHeight.normal,
        fontWeight: theme.typography.fontWeight.semibold,
      };
    case 'h4':
      return {
        fontSize: theme.typography.fontSize.xl,
        lineHeight: theme.typography.fontSize.xl * theme.typography.lineHeight.normal,
        fontWeight: theme.typography.fontWeight.semibold,
      };
    case 'body':
      return {
        fontSize: theme.typography.fontSize.base,
        lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
        fontWeight: theme.typography.fontWeight.normal,
      };
    case 'caption':
      return {
        fontSize: theme.typography.fontSize.sm,
        lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
        fontWeight: theme.typography.fontWeight.normal,
      };
    case 'button':
      return {
        fontSize: theme.typography.fontSize.base,
        lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.tight,
        fontWeight: theme.typography.fontWeight.semibold,
      };
    default:
      return {
        fontSize: theme.typography.fontSize.base,
        lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
        fontWeight: theme.typography.fontWeight.normal,
      };
  }
};

const getColorValue = (color: string): string => {
  if (color.startsWith('#') || color.startsWith('rgb')) {
    return color;
  }
  
  const colorPath = color.split('.');
  if (colorPath.length === 1) {
    return (theme.colors.text as any)[color] || theme.colors.text.primary;
  }
  
  return theme.colors.text.primary;
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = 'primary',
  align = 'left',
  weight,
  children,
  style,
  numberOfLines,
}) => {
  const variantStyle = getVariantStyle(variant);
  const colorValue = getColorValue(color);
  
  const finalStyle: TextStyle = {
    ...variantStyle,
    color: colorValue,
    textAlign: align,
    ...(weight && { fontWeight: theme.typography.fontWeight[weight] }),
    ...style,
  };

  return (
    <Text style={finalStyle} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};
