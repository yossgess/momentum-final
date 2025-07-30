export interface NavBarProps {
  title: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  backgroundColor?: string;
  showBackButton?: boolean;
  style?: any;
}
