export interface Sport {
  id: string;
  name: string;
  icon: string;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CommonSportsDisplayProps {
  sharedSports: Sport[];
  userSports?: Sport[]; // Keep for backward compatibility but not used
  title?: string;
  showTitle?: boolean;
  style?: any;
}
