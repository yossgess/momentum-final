export interface SwitchProps {
  value: boolean;
  onToggle: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  activeColor?: string;
  inactiveColor?: string;
}
