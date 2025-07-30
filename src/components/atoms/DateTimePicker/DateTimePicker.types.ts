export interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  style?: any;
}
