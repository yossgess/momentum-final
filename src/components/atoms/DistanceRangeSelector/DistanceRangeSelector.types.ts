export interface DistanceRangeSelectorProps {
  min?: number;
  max?: number;
  step?: number;
  initialValue?: number;
  onChange: (value: number) => void;
  label?: string;
  icon?: string;
  style?: any;
}
