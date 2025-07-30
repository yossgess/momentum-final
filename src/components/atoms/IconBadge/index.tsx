import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { IconBadgeProps } from './IconBadge.types';
import { styles } from './IconBadge.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const IconBadge: React.FC<IconBadgeProps> = ({
  icon,
  iconFamily = 'Ionicons',
  badgeCount = 0,
  showBadge = false,
  onPress,
  size = 'md',
  color = theme.colors.text.primary,
  badgeColor = theme.colors.status.error,
  maxCount = 99,
}) => {
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 20;
      case 'lg': return 28;
      default: return 24;
    }
  };

  const handlePress = () => {
    if (onPress) {
      logEvent(Events.ICON_BADGE_PRESSED, { icon, badgeCount });
      onPress();
    }
  };

  const getIconComponent = () => {
    const iconSize = getIconSize();
    const iconProps = {
      name: icon as any,
      size: iconSize,
      color,
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

  const getBadgeText = () => {
    if (badgeCount > maxCount) {
      return `${maxCount}+`;
    }
    return badgeCount.toString();
  };

  const content = (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {getIconComponent()}
      </View>
      
      {showBadge && (
        <>
          {badgeCount > 0 ? (
            <View style={[styles.badge, { backgroundColor: badgeColor }]}>
              <Text style={styles.badgeText}>{getBadgeText()}</Text>
            </View>
          ) : (
            <View style={[styles.dot, { backgroundColor: badgeColor }]} />
          )}
        </>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={handlePress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
        {content}
      </Pressable>
    );
  }

  return content;
};
