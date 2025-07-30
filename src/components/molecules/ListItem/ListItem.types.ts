export interface ListItemProps {
  title: string;
  subtitle?: string;
  icon?: string;
  image?: { uri: string } | number;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'switch' | 'badge';
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  badgeCount?: number;
  disabled?: boolean;
  style?: any;
}
