export interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export interface BottomActionBarProps {
  primaryButton: ActionButtonProps;
  secondaryButton?: ActionButtonProps;
  backgroundColor?: string;
  style?: any;
}
