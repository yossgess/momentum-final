import React from 'react';
import { View } from 'react-native';
import { Button } from '../../atoms/Button';
import { IconButtonGroupProps } from './IconButtonGroup.types';
import { styles } from './IconButtonGroup.styles';

export const IconButtonGroup: React.FC<IconButtonGroupProps> = ({
  buttons,
  selectedIndex,
  onPress,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant={selectedIndex === index ? 'primary' : variant}
          size={size}
          icon={button.icon}
          iconFamily={button.iconFamily}
          onPress={() => onPress(index)}
          disabled={disabled || button.disabled}
          style={[
            styles.button,
            index > 0 && styles.buttonSpacing,
          ] as any}
        />
      ))}
    </View>
  );
};
