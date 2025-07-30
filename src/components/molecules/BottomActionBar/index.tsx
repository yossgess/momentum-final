import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../atoms/Button';
import { BottomActionBarProps } from './BottomActionBar.types';
import { styles } from './BottomActionBar.styles';

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  primaryButton,
  secondaryButton,
  backgroundColor,
  style,
}) => {
  if (!primaryButton) return null;
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom, backgroundColor },
        style,
      ]}
    >
      <View style={styles.content}>
        {secondaryButton && (
          <Button
            variant={secondaryButton.variant || 'secondary'}
            onPress={secondaryButton.onPress}
            disabled={secondaryButton.disabled}
            loading={secondaryButton.loading}
            style={styles.secondaryButton}
          >
            {secondaryButton.label}
          </Button>
        )}
        
        <Button
          variant={primaryButton.variant || 'primary'}
          onPress={primaryButton.onPress}
          disabled={primaryButton.disabled}
          loading={primaryButton.loading}
          style={styles.primaryButton}
        >
          {primaryButton.label}
        </Button>
      </View>
    </View>
  );
};
