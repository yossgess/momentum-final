import React from 'react';
import { View, Image, ViewStyle, ImageStyle } from 'react-native';
import { Typography } from '../Typography';
import { theme } from '../../../theme';

export interface AvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  source?: { uri: string } | number;
  initials?: string;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  borderColor?: string;
  borderWidth?: number;
}

const getSizeStyle = (size: AvatarProps['size']) => {
  const sizes = {
    sm: { width: 32, height: 32, borderRadius: 16 },
    md: { width: 48, height: 48, borderRadius: 24 },
    lg: { width: 64, height: 64, borderRadius: 32 },
    xl: { width: 96, height: 96, borderRadius: 48 },
  };
  
  return sizes[size || 'md'];
};

const getInitialsFontSize = (size: AvatarProps['size']) => {
  const fontSizes = {
    sm: theme.typography.fontSize.xs,
    md: theme.typography.fontSize.sm,
    lg: theme.typography.fontSize.base,
    xl: theme.typography.fontSize.lg,
  };
  
  return fontSizes[size || 'md'];
};

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  source,
  initials,
  style,
  imageStyle,
  borderColor,
  borderWidth = 0,
}) => {
  const sizeStyle = getSizeStyle(size);
  const fontSize = getInitialsFontSize(size);
  
  const containerStyle: ViewStyle = {
    ...sizeStyle,
    backgroundColor: theme.colors.surface.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...(borderWidth > 0 && {
      borderWidth,
      borderColor: borderColor || theme.colors.border.primary,
    }),
    ...style,
  };

  if (source) {
    return (
      <View style={containerStyle}>
        <Image
          source={source}
          style={[
            {
              width: sizeStyle.width,
              height: sizeStyle.height,
            },
            imageStyle,
          ]}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Typography
        variant="body"
        color={theme.colors.text.primary}
        weight="semibold"
        style={{ fontSize }}
      >
        {initials || '?'}
      </Typography>
    </View>
  );
};
