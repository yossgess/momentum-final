import React from 'react';
import { View, Modal, Pressable } from 'react-native';
import { Typography } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';
import { ConfirmationModalProps } from './ConfirmationModal.types';
import { styles } from './ConfirmationModal.styles';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  confirmVariant = 'danger',
  cancelVariant = 'ghost',
}) => {
  const handleConfirm = () => {
    logEvent(Events.MODAL_CLOSED, { action: 'confirm', title });
    onConfirm();
  };

  const handleCancel = () => {
    logEvent(Events.MODAL_CLOSED, { action: 'cancel', title });
    onCancel();
  };

  const handleBackdropPress = () => {
    logEvent(Events.MODAL_CLOSED, { action: 'backdrop', title });
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={handleBackdropPress}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          <View style={styles.content}>
            <Typography variant="h3" color="primary" style={styles.title}>
              {title}
            </Typography>
            
            <Typography variant="body" color="secondary" style={styles.message}>
              {message}
            </Typography>
            
            <View style={styles.buttonContainer}>
              <Button
                variant={cancelVariant}
                onPress={handleCancel}
                style={styles.button}
              >
                {cancelText}
              </Button>
              
              <Button
                variant={confirmVariant}
                onPress={handleConfirm}
                style={styles.button}
              >
                {confirmText}
              </Button>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
