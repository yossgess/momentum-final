import React from 'react';
import { View, Text } from 'react-native';
import { DividerProps } from './Divider.types';
import { styles } from './Divider.styles';

export const Divider: React.FC<DividerProps> = ({
  label,
  orientation = 'horizontal',
  color,
  thickness = 1,
  style,
}) => {
  const dividerStyle = [
    orientation === 'horizontal' ? styles.horizontal : styles.vertical,
    {
      backgroundColor: color,
      [orientation === 'horizontal' ? 'height' : 'width']: thickness,
    },
    style,
  ];

  if (label) {
    return (
      <View style={styles.labelContainer}>
        <View style={[dividerStyle, styles.labelDivider]} />
        <Text style={styles.labelText}>{label}</Text>
        <View style={[dividerStyle, styles.labelDivider]} />
      </View>
    );
  }

  return <View style={dividerStyle} />;
};
