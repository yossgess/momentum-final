import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../Typography';
import { theme } from '../../../theme';
import { AuthValidation } from '../../../shared/utils/authValidation';
import { t } from '../../../shared/utils/i18n';

interface PasswordStrengthIndicatorProps {
  password: string;
  showFeedback?: boolean;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showFeedback = true,
}) => {
  const strength = AuthValidation.validatePassword(password);
  const { label, color } = AuthValidation.getPasswordStrengthInfo(strength.score);

  if (!password) return null;

  return (
    <View style={styles.container}>
      {/* Strength Bar */}
      <View style={styles.strengthBar}>
        {[0, 1, 2, 3, 4].map((index) => (
          <View
            key={index}
            style={[
              styles.strengthSegment,
              {
                backgroundColor: index <= strength.score ? color : theme.colors.surface.tertiary,
              },
            ]}
          />
        ))}
      </View>

      {/* Strength Label */}
      <View style={styles.labelContainer}>
        <Typography
          variant="caption"
          color={color}
          style={styles.strengthLabel}
        >
          {label}
        </Typography>
      </View>

      {/* Feedback Messages */}
      {showFeedback && strength.feedback.length > 0 && (
        <View style={styles.feedbackContainer}>
          {strength.feedback.map((feedback, index) => (
            <Typography
              key={index}
              variant="caption"
              color={theme.colors.text.secondary}
              style={styles.feedbackText}
            >
              • {feedback}
            </Typography>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.sm,
  },
  strengthBar: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  strengthSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  labelContainer: {
    alignItems: 'flex-end',
    marginBottom: theme.spacing.xs,
  },
  strengthLabel: {
    fontWeight: '600',
  },
  feedbackContainer: {
    marginTop: theme.spacing.xs,
  },
  feedbackText: {
    marginBottom: theme.spacing.xs / 2,
    lineHeight: 16,
  },
});
