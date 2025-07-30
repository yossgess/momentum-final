export interface Sport {
  id: string;
  name: string;
  icon: string;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface SportsGridSelectorProps {
  sports: Sport[];
  selected: string[];
  onSelect: (sportId: string) => void;
  onDeselect: (sportId: string) => void;
  maxSelectable?: number;
  multiSelect?: boolean;
  title?: string;
  style?: any;
}
