export interface PhotoSelectorProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  maxImages?: number;
  style?: any;
}
