import React from 'react';
import { View, Modal, Pressable, Image } from 'react-native';
import { Typography } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';
import { MatchModalProps } from './MatchModal.types';
import { styles } from './MatchModal.styles';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { t } from '../../../shared/utils/i18n';

export const MatchModal: React.FC<MatchModalProps> = ({
  visible,
  currentUser,
  matchedUser,
  onSendMessage,
  onKeepSwiping,
  onClose,
}) => {
  const handleSendMessage = () => {
    logEvent(Events.MATCH_MODAL_VIEWED, { 
      matchedUserId: matchedUser.id,
      action: 'send_message' 
    });
    onSendMessage();
  };

  const handleKeepSwiping = () => {
    logEvent(Events.MATCH_MODAL_VIEWED, { 
      matchedUserId: matchedUser.id,
      action: 'keep_swiping' 
    });
    onKeepSwiping();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />
        
        <View style={styles.container}>
          <Typography variant="h1" color="primary" style={styles.title}>
            {t('discovery.match')}
          </Typography>
          
          <View style={styles.imagesContainer}>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: currentUser.image }}
                style={styles.userImage}
                resizeMode="cover"
              />
            </View>
            
            <View style={styles.heartContainer}>
              <Typography variant="h1" style={styles.heartIcon}>
                💖
              </Typography>
            </View>
            
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: matchedUser.image }}
                style={styles.userImage}
                resizeMode="cover"
              />
            </View>
          </View>
          
          <Typography variant="body" color="secondary" style={styles.subtitle}>
            You and {matchedUser.name} liked each other!
          </Typography>
          
          <View style={styles.actions}>
            <Button
              variant="primary"
              onPress={handleSendMessage}
              style={styles.primaryButton}
            >
              {t('discovery.sendMessage')}
            </Button>
            
            <Button
              variant="ghost"
              onPress={handleKeepSwiping}
              style={styles.secondaryButton}
            >
              {t('discovery.keepSwiping')}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
