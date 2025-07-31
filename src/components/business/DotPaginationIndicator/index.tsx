import React from 'react';
import { View } from 'react-native';
import { DotPaginationIndicatorProps } from './DotPaginationIndicator.types';
import { styles } from './DotPaginationIndicator.styles';

export const DotPaginationIndicator: React.FC<DotPaginationIndicatorProps> = ({
  total,
  currentIndex,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: total }, (_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );
};
