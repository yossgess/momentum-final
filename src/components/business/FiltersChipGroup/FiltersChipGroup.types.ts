export interface Filter {
  id: string;
  label: string;
  value?: any;
}

export interface FiltersChipGroupProps {
  filters: Filter[];
  selectedFilters: string[];
  onFilterToggle: (filterId: string) => void;
  title?: string;
  horizontal?: boolean;
  style?: any;
}
