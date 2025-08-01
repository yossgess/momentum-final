import { ViewStyle } from 'react-native';

export interface DistanceSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  style?: ViewStyle;
  testID?: string;
}

export interface AgeRangeSliderProps {
  values: [number, number];
  onValuesChange: (values: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  style?: ViewStyle;
  testID?: string;
}
