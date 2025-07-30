import React, { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SearchBarProps } from './SearchBar.types';
import { styles } from './SearchBar.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder,
  onClear,
  onSubmit,
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    logEvent(Events.SEARCH_PERFORMED, { query: value });
    onSubmit?.();
  };

  const handleClear = () => {
    onClear?.();
    onChangeText('');
  };

  return (
    <View style={[styles.container, isFocused && styles.containerFocused, style]}>
      <Ionicons
        name="search"
        size={20}
        color={theme.colors.text.secondary}
        style={styles.searchIcon}
      />
      
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.tertiary}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
      />
      
      {value.length > 0 && (
        <Pressable onPress={handleClear} style={styles.clearButton}>
          <Ionicons
            name="close-circle"
            size={20}
            color={theme.colors.text.secondary}
          />
        </Pressable>
      )}
    </View>
  );
};
