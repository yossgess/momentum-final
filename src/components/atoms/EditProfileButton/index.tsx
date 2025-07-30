import React from 'react';
import { Button } from '../Button';
import { EditProfileButtonProps } from './EditProfileButton.types';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const EditProfileButton: React.FC<EditProfileButtonProps> = ({
  onPress,
  variant = 'primary',
  label,
  floating = false,
  disabled = false,
  style,
}) => {
  const handlePress = () => {
    if (disabled) return;
    logEvent(Events.EDIT_PROFILE_PRESSED, { variant, floating });
    onPress();
  };

  if (floating) {
    return (
      <Button
        variant="iconButton"
        icon="pencil"
        onPress={handlePress}
        disabled={disabled}
        style={[
          {
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: '#00A89D',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          },
          style,
        ] as any}
      />
    );
  }

  return (
    <Button
      variant={variant}
      icon="pencil"
      onPress={handlePress}
      disabled={disabled}
      style={style}
    >
      {label}
    </Button>
  );
};
