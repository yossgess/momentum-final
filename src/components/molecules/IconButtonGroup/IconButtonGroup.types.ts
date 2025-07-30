export interface IconButtonItem {
  icon: string;
  iconFamily?: 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons';
  disabled?: boolean;
}

export interface IconButtonGroupProps {
  buttons: IconButtonItem[];
  selectedIndex?: number;
  onPress: (index: number) => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: any;
}
