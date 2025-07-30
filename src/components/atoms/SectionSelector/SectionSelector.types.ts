export interface SectionSelectorProps {
  sections: string[];
  selectedIndex: number;
  onSelectionChange: (index: number) => void;
  disabled?: boolean;
}
