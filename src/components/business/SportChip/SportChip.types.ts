export interface Sport {
  id: string;
  name: string;
  icon: string;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface SportChipProps {
  sport: Sport;
  selected?: boolean;
  onPress?: (sport: Sport) => void;
  variant?: 'filled' | 'outlined' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: any;
}
