export interface AvatarProps {
  uri?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  onPress?: () => void;
  showBorder?: boolean;
  borderColor?: string;
}
