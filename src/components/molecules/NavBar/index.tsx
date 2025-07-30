import React from 'react';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../atoms/Typography';
import { NavBarProps } from './NavBar.types';
import { styles } from './NavBar.styles';
import { theme } from '../../../theme';

export const NavBar: React.FC<NavBarProps> = ({
  title,
  leftIcon = 'arrow-back',
  rightIcon,
  onLeftPress,
  onRightPress,
  backgroundColor = theme.colors.background.primary,
  showBackButton = true,
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor },
        style,
      ]}
    >
      <View style={styles.content}>
        {showBackButton && (
          <Pressable style={styles.leftButton} onPress={onLeftPress}>
            <Ionicons
              name={leftIcon as any}
              size={24}
              color={theme.colors.text.primary}
            />
          </Pressable>
        )}

        <View style={styles.titleContainer}>
          <Typography variant="h3" color="primary" align="center">
            {title}
          </Typography>
        </View>

        {rightIcon ? (
          <Pressable style={styles.rightButton} onPress={onRightPress}>
            <Ionicons
              name={rightIcon as any}
              size={24}
              color={theme.colors.text.primary}
            />
          </Pressable>
        ) : (
          <View style={styles.rightButton} />
        )}
      </View>
    </View>
  );
};
