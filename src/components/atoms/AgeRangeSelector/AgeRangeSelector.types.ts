export interface AgeRangeSelectorProps {
  min?: number;
  max?: number;
  step?: number;
  initialRange?: [number, number];
  onChange: (range: [number, number]) => void;
  label?: string;
  style?: any;
}
