export interface Sport {
  id: string;
  name: string;
  icon: string;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface SportPreferencesSummaryProps {
  sports: Sport[];
  title?: string;
  variant?: 'list' | 'grid';
  style?: any;
}
