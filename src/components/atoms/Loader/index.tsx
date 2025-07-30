import React from 'react';
import { View, Text, ActivityIndicator, Modal } from 'react-native';
import { LoaderProps } from './Loader.types';
import { styles } from './Loader.styles';
import { theme } from '../../../theme';

export const Loader: React.FC<LoaderProps> = ({
  size = 'large',
  color = theme.colors.primary.main,
  variant = 'inline',
  isVisible = true,
  text,
}) => {
  if (!isVisible) return null;

  const getSize = () => {
    if (typeof size === 'number') return size;
    return size;
  };

  const renderLoader = () => (
    <>
      <ActivityIndicator size={getSize()} color={color} />
      {text && (
        <Text style={[
          styles.text,
          variant === 'fullScreen' && styles.fullScreenText,
        ]}>
          {text}
        </Text>
      )}
    </>
  );

  if (variant === 'fullScreen') {
    return (
      <Modal transparent visible={isVisible} animationType="fade">
        <View style={styles.fullScreenContainer}>
          {renderLoader()}
        </View>
      </Modal>
    );
  }

  if (variant === 'button') {
    return (
      <View style={styles.buttonContainer}>
        {renderLoader()}
      </View>
    );
  }

  return (
    <View style={styles.inlineContainer}>
      {renderLoader()}
    </View>
  );
};
