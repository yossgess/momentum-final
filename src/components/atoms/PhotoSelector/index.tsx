import React, { useState } from 'react';
import { View, Text, Pressable, Image, Alert } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { PhotoSelectorProps } from './PhotoSelector.types';
import { styles } from './PhotoSelector.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { t } from '../../../shared/utils/i18n';

export const PhotoSelector: React.FC<PhotoSelectorProps> = ({
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  multiple = false,
  maxImages = 5,
  style,
}) => {
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    Alert.alert(
      'Permission Required',
      'This feature requires expo-image-picker package'
    );
    return false;
  };

  const handleSelectPhoto = async () => {
    if (disabled || loading) return;

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setLoading(true);
    logEvent(Events.PHOTO_SELECTED, { multiple });

    try {
      Alert.alert('Photo Selection', 'This feature requires expo-image-picker package');
    } catch (error) {
      console.error('Error selecting photo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    if (disabled || loading) return;

    setLoading(true);

    try {
      Alert.alert('Camera', 'This feature requires expo-image-picker package');
    } catch (error) {
      console.error('Error taking photo:', error);
    } finally {
      setLoading(false);
    }
  };

  const showActionSheet = () => {
    Alert.alert(
      t('common.selectPhoto'),
      t('common.selectPhotoMessage'),
      [
        { text: t('common.camera'), onPress: handleTakePhoto },
        { text: t('common.gallery'), onPress: handleSelectPhoto },
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  const renderPreview = () => {
    if (!value) return null;

    if (multiple && Array.isArray(value)) {
      return (
        <View style={styles.previewContainer}>
          {value.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.previewImage} />
          ))}
        </View>
      );
    }

    if (typeof value === 'string') {
      return (
        <View style={styles.previewContainer}>
          <Image source={{ uri: value }} style={styles.previewImageSingle} />
        </View>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <Pressable
        style={[
          styles.selector,
          disabled && styles.selectorDisabled,
          value && styles.selectorWithImage,
        ]}
        onPress={showActionSheet}
        disabled={disabled || loading}
      >
        {value ? (
          renderPreview()
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons
              name="camera-outline"
              size={32}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.placeholderText}>
              {placeholder || t('common.addPhoto')}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};
