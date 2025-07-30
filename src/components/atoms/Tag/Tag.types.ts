export interface TagProps {
  label: string;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  closable?: boolean;
  onPress?: () => void;
  onClose?: () => void;
  disabled?: boolean;
}
