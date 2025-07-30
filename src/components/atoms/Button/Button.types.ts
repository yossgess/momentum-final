export interface ButtonProps {
  label?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'iconButton';
  icon?: string;
  iconFamily?: 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons';
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children?: React.ReactNode;
}
