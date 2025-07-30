export interface SettingsButtonProps {
  onPress: () => void;
  variant?: 'iconOnly' | 'withLabel';
  label?: string;
  disabled?: boolean;
  style?: any;
}
