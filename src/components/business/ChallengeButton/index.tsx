import React from 'react';
import { Pressable, Text, Image } from 'react-native';
import { ChallengeButtonProps } from './ChallengeButton.types';
import { styles } from './ChallengeButton.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const ChallengeButton: React.FC<ChallengeButtonProps> = ({
  onPress,
  disabled = false,
  size = 'lg',
  style,
}) => {
  const handlePress = () => {
    if (disabled) return;
    logEvent(Events.CHALLENGE_BUTTON_PRESSED, { size });
    onPress();
  };

  return (
    <Pressable
      style={[
        styles.container,
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
    >
      <Image
        source={require('../../../../assets/concurrence.png')}
        style={{
          width: size === 'sm' ? 20 : size === 'lg' ? 32 : 24,
          height: size === 'sm' ? 20 : size === 'lg' ? 32 : 24,
          opacity: disabled ? 0.5 : 1,
          tintColor: disabled ? theme.colors.text.tertiary : theme.colors.primary.main,
        }}
        resizeMode="contain"
      />
    </Pressable>
  );
};
