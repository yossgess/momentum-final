import { ViewStyle } from 'react-native';

export interface RevertButtonProps {
  onPress: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}
