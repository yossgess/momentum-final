import React, { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatInputBarProps } from './ChatInputBar.types';
import { styles } from './ChatInputBar.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { t } from '../../../shared/utils/i18n';

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  value,
  onChange,
  onSend,
  onAttach,
  placeholder,
  disabled = false,
}) => {
  const [inputHeight, setInputHeight] = useState(40);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    logEvent(Events.MESSAGE_SENT, { messageLength: value.length });
    onSend(value.trim());
  };

  const handleAttach = () => {
    if (disabled) return;
    onAttach?.();
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {onAttach && (
          <Pressable onPress={handleAttach} style={styles.attachButton}>
            <Ionicons
              name="add"
              size={24}
              color={disabled ? theme.colors.text.tertiary : theme.colors.text.secondary}
            />
          </Pressable>
        )}

        <TextInput
          style={[
            styles.input,
            { height: Math.max(40, inputHeight) },
            disabled && styles.inputDisabled,
          ]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder || t('chat.typeMessage')}
          placeholderTextColor={theme.colors.text.tertiary}
          multiline
          textAlignVertical="center"
          onContentSizeChange={(event) => {
            setInputHeight(event.nativeEvent.contentSize.height);
          }}
          editable={!disabled}
          maxLength={1000}
        />

        <Pressable
          onPress={handleSend}
          style={[
            styles.sendButton,
            canSend && styles.sendButtonActive,
          ]}
          disabled={!canSend}
        >
          <Ionicons
            name="send"
            size={20}
            color={canSend ? theme.colors.text.primary : theme.colors.text.tertiary}
          />
        </Pressable>
      </View>
    </View>
  );
};
