export interface Sport {
  id: string;
  name: string;
  icon: string;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface SportFilterChipsGroupProps {
  selectedFilters: string[];
  onChange: (selectedIds: string[]) => void;
  title?: string;
  showClearAll?: boolean;
  showSelectAll?: boolean;
  style?: any;
}
