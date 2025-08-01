import React, { useState } from 'react';
import { View, Text, Pressable, Image, Alert, ScrollView, ActionSheetIOS, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { PhotoSelectorProps, PhotoData } from './PhotoSelector.types';
import { styles } from './PhotoSelector.styles';
import { theme } from '../../../theme';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { t } from '../../../shared/utils/i18n';

export const PhotoSelector: React.FC<PhotoSelectorProps> = ({
  photos = [],
  mainPhotoIndex = 0,
  onPhotosChange,
  onMainPhotoChange,
  label,
  placeholder,
  disabled = false,
  maxImages = 5,
  style,
}) => {
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        t('photo.permissionRequired'),
        t('photo.permissionMessage')
      );
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        t('photo.cameraPermissionRequired'),
        t('photo.cameraPermissionMessage')
      );
      return false;
    }
    return true;
  };

  const generatePhotoId = () => {
    return `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSelectPhoto = async () => {
    if (disabled || loading || photos.length >= maxImages) return;

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setLoading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto: PhotoData = {
          uri: result.assets[0].uri,
          id: generatePhotoId(),
        };
        const updatedPhotos = [...photos, newPhoto];
        onPhotosChange(updatedPhotos);
        
        // Set as main photo if it's the first photo
        if (photos.length === 0) {
          onMainPhotoChange(0);
        }
        
        logEvent(Events.PHOTO_UPLOADED, { uri: newPhoto.uri, totalPhotos: updatedPhotos.length });
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert(t('photo.error'), t('photo.selectError'));
    } finally {
      setLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    if (disabled || loading || photos.length >= maxImages) return;

    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    setLoading(true);

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto: PhotoData = {
          uri: result.assets[0].uri,
          id: generatePhotoId(),
        };
        const updatedPhotos = [...photos, newPhoto];
        onPhotosChange(updatedPhotos);
        
        // Set as main photo if it's the first photo
        if (photos.length === 0) {
          onMainPhotoChange(0);
        }
        
        logEvent(Events.PHOTO_UPLOADED, { uri: newPhoto.uri, totalPhotos: updatedPhotos.length });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert(t('photo.error'), t('photo.cameraError'));
    } finally {
      setLoading(false);
    }
  };

  const showAddPhotoActionSheet = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t('photo.camera'), t('photo.gallery'), t('common.cancel')],
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            handleTakePhoto();
          } else if (buttonIndex === 1) {
            handleSelectPhoto();
          }
        }
      );
    } else {
      Alert.alert(
        t('photo.selectPhoto'),
        t('photo.selectPhotoMessage'),
        [
          { text: t('photo.camera'), onPress: handleTakePhoto },
          { text: t('photo.gallery'), onPress: handleSelectPhoto },
          { text: t('common.cancel'), style: 'cancel' },
        ]
      );
    }
  };

  const showPhotoActionSheet = (index: number) => {
    const isMainPhoto = index === mainPhotoIndex;
    const options = [
      !isMainPhoto ? t('photo.setAsMain') : null,
      t('photo.replace'),
      t('photo.delete'),
      t('common.cancel'),
    ].filter(Boolean) as string[];
    
    const cancelIndex = options.length - 1;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex: options.indexOf(t('photo.delete')),
          cancelButtonIndex: cancelIndex,
        },
        (buttonIndex) => {
          if (buttonIndex === cancelIndex) return;
          
          if (!isMainPhoto && buttonIndex === 0) {
            handleSetAsMain(index);
          } else if ((!isMainPhoto && buttonIndex === 1) || (isMainPhoto && buttonIndex === 0)) {
            handleReplacePhoto(index);
          } else if ((!isMainPhoto && buttonIndex === 2) || (isMainPhoto && buttonIndex === 1)) {
            handleDeletePhoto(index);
          }
        }
      );
    } else {
      const alertOptions = [];
      if (!isMainPhoto) {
        alertOptions.push({ text: t('photo.setAsMain'), onPress: () => handleSetAsMain(index) });
      }
      alertOptions.push(
        { text: t('photo.replace'), onPress: () => handleReplacePhoto(index) },
        { text: t('photo.delete'), onPress: () => handleDeletePhoto(index), style: 'destructive' as const },
        { text: t('common.cancel'), style: 'cancel' as const }
      );
      
      Alert.alert(t('photo.photoOptions'), '', alertOptions);
    }
  };

  const handleSetAsMain = (index: number) => {
    onMainPhotoChange(index);
    logEvent(Events.MAIN_PHOTO_SELECTED, { index, photoId: photos[index]?.id });
  };

  const handleReplacePhoto = async (index: number) => {
    if (disabled || loading) return;

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setLoading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const updatedPhotos = [...photos];
        updatedPhotos[index] = {
          uri: result.assets[0].uri,
          id: generatePhotoId(),
        };
        onPhotosChange(updatedPhotos);
        logEvent(Events.PHOTO_REPLACED, { index, newUri: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error replacing photo:', error);
      Alert.alert(t('photo.error'), t('photo.replaceError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = (index: number) => {
    Alert.alert(
      t('photo.deletePhoto'),
      t('photo.deletePhotoMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('photo.delete'),
          style: 'destructive',
          onPress: () => {
            const updatedPhotos = photos.filter((_, i) => i !== index);
            onPhotosChange(updatedPhotos);
            
            // Adjust main photo index if necessary
            if (index === mainPhotoIndex && updatedPhotos.length > 0) {
              onMainPhotoChange(0);
            } else if (index < mainPhotoIndex) {
              onMainPhotoChange(mainPhotoIndex - 1);
            }
            
            logEvent(Events.PHOTO_DELETED, { index, photoId: photos[index]?.id });
          },
        },
      ]
    );
  };

  const renderPhotoThumbnail = (photo: PhotoData, index: number) => {
    const isMainPhoto = index === mainPhotoIndex;
    
    return (
      <Pressable
        key={photo.id}
        style={[
          styles.photoThumbnail,
          isMainPhoto && styles.mainPhotoThumbnail,
        ]}
        onPress={() => showPhotoActionSheet(index)}
        disabled={disabled}
      >
        <Image source={{ uri: photo.uri }} style={styles.thumbnailImage} />
        {isMainPhoto && (
          <View style={styles.mainPhotoBadge}>
            <Ionicons name="star" size={12} color={theme.colors.primary.main} />
          </View>
        )}
      </Pressable>
    );
  };

  const renderAddPhotoButton = () => {
    if (photos.length >= maxImages) return null;
    
    return (
      <Pressable
        style={styles.addPhotoButton}
        onPress={showAddPhotoActionSheet}
        disabled={disabled || loading}
      >
        <Ionicons
          name="add-circle-outline"
          size={24}
          color={disabled ? theme.colors.text.tertiary : theme.colors.primary.main}
        />
        <Text style={[
          styles.addPhotoText,
          disabled && styles.addPhotoTextDisabled,
        ]}>
          {t('photo.addPhoto')}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.photosContainer}
      >
        {photos.map((photo, index) => renderPhotoThumbnail(photo, index))}
        {renderAddPhotoButton()}
      </ScrollView>
      
      {photos.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons
            name="camera-outline"
            size={32}
            color={theme.colors.text.secondary}
          />
          <Text style={styles.emptyStateText}>
            {placeholder || t('photo.addYourFirstPhoto')}
          </Text>
        </View>
      )}
    </View>
  );
};
