export interface Sport {
  id: string;
  name: string;
  icon: string;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CommonSportsDisplayProps {
  sharedSports: Sport[];
  userSports: Sport[];
  title?: string;
  showTitle?: boolean;
  style?: any;
}
