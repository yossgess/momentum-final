import React from 'react';
import { View } from 'react-native';
import { Typography } from '../../atoms/Typography';
import { ChatBubbleProps } from './ChatBubble.types';
import { styles } from './ChatBubble.styles';

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  timestamp,
  isSender,
  status,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[styles.container, isSender ? styles.senderContainer : styles.receiverContainer]}>
      <View style={[styles.bubble, isSender ? styles.senderBubble : styles.receiverBubble]}>
        <Typography
          variant="body"
          color={isSender ? 'primary' : 'primary'}
          style={styles.message}
        >
          {message}
        </Typography>
        
        <View style={styles.footer}>
          <Typography variant="caption" color="tertiary" style={styles.timestamp}>
            {formatTime(timestamp)}
          </Typography>
          
          {isSender && status && (
            <Typography variant="caption" color="tertiary" style={styles.status}>
              {status}
            </Typography>
          )}
        </View>
      </View>
    </View>
  );
};
