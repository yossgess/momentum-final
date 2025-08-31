import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Typography } from '../Typography';
import { theme } from '../../../theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    aspectRatio: 1,
  },
});
