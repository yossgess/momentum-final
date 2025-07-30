export interface InputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  variant?: 'default' | 'password' | 'numeric';
  label?: string;
  errorText?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  iconFamily?: 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons';
  onRightIconPress?: () => void;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}
