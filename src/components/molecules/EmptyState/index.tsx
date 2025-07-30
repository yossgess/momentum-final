import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';
import { EmptyStateProps } from './EmptyState.types';
import { styles } from './EmptyState.styles';
import { theme } from '../../../theme';

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon && (
        <Ionicons
          name={icon as any}
          size={64}
          color={theme.colors.text.tertiary}
          style={styles.icon}
        />
      )}
      
      <Typography variant="h3" color="primary" style={styles.title}>
        {title}
      </Typography>
      
      {description && (
        <Typography variant="body" color="secondary" style={styles.description}>
          {description}
        </Typography>
      )}
      
      {actionLabel && onAction && (
        <Button
          variant="primary"
          onPress={onAction}
          style={styles.action}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
};
