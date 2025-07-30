export interface IconBadgeProps {
  icon: string;
  iconFamily?: 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons';
  badgeCount?: number;
  showBadge?: boolean;
  onPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  badgeColor?: string;
  maxCount?: number;
}
