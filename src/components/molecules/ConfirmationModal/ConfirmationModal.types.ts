export interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmVariant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  cancelVariant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
}
