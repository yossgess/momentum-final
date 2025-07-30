export interface EditProfileButtonProps {
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  label?: string;
  floating?: boolean;
  disabled?: boolean;
  style?: any;
}
