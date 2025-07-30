import React from 'react';
import { View, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../atoms/Typography';
import { Switch } from '../../atoms/Switch';
import { ListItemProps } from './ListItem.types';
import { styles } from './ListItem.styles';
import { theme } from '../../../theme';

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  icon,
  image,
  rightElement,
  onPress,
  variant = 'default',
  switchValue,
  onSwitchChange,
  badgeCount,
  disabled = false,
  style,
}) => {
  const renderLeftElement = () => {
    if (image) {
      return (
        <Image source={image} style={styles.image} />
      );
    }
    
    if (icon) {
      return (
        <Ionicons
          name={icon as any}
          size={24}
          color={theme.colors.text.secondary}
          style={styles.icon}
        />
      );
    }
    
    return null;
  };

  const renderRightElement = () => {
    if (variant === 'switch' && onSwitchChange) {
      return (
        <Switch
          value={switchValue || false}
          onToggle={onSwitchChange}
          disabled={disabled}
        />
      );
    }
    
    if (variant === 'badge' && badgeCount !== undefined) {
      return (
        <View style={styles.badge}>
          <Typography variant="caption" color={theme.colors.text.primary}>
            {badgeCount}
          </Typography>
        </View>
      );
    }
    
    if (rightElement) {
      return rightElement;
    }
    
    if (onPress) {
      return (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.text.tertiary}
        />
      );
    }
    
    return null;
  };

  const content = (
    <View style={[styles.container, disabled && styles.containerDisabled, style]}>
      {renderLeftElement()}
      
      <View style={styles.content}>
        <Typography
          variant="body"
          color={disabled ? 'tertiary' : 'primary'}
          weight="medium"
        >
          {title}
        </Typography>
        
        {subtitle && (
          <Typography
            variant="caption"
            color={disabled ? 'tertiary' : 'secondary'}
            style={styles.subtitle}
          >
            {subtitle}
          </Typography>
        )}
      </View>
      
      {renderRightElement()}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <Pressable onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return content;
};
