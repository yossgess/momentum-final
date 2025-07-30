export interface ChatInputBarProps {
  value: string;
  onChange: (text: string) => void;
  onSend: (message: string) => void;
  onAttach?: () => void;
  placeholder?: string;
  disabled?: boolean;
}
