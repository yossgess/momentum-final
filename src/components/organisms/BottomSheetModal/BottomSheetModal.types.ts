export interface BottomSheetModalProps {
  visible: boolean;
  title?: string;
  snapPoints?: string[];
  children: React.ReactNode;
  onClose: () => void;
  enableBackdropDismiss?: boolean;
}
