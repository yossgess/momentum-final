export interface AgeRangeSelectorProps {
  value: [number, number]; // e.g., [25, 40]
  onChange: (range: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  style?: any;
}
