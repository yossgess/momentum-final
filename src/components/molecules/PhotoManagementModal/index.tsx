import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Typography } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';
import { theme } from '../../../theme';
import { t } from '../../../shared/utils/i18n';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { StyleSheet } from 'react-native';
import { storageService } from '../../../shared/services/storageService';
import { useAuthStore } from '../../../shared/stores/authStore';

export interface PhotoManagementModalProps {
  visible: boolean;
  onClose: () => void;
  photos: (string | null)[];
  onPhotosChange: (photos: (string | null)[]) => void;
  maxPhotos?: number;
}

export const PhotoManagementModal: React.FC<PhotoManagementModalProps> = ({
  visible,
  onClose,
  photos,
  onPhotosChange,
  maxPhotos = 6,
}) => {
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [selectedForSwap, setSelectedForSwap] = useState<number | null>(null);
  const [animatedValues] = useState(() => 
    Array.from({ length: maxPhotos }, () => new Animated.Value(1))
  );

  const handleAddPhoto = async (index: number) => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          t('photo.permissionRequired'),
          t('photo.permissionMessage')
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Upload to Supabase storage first
        try {
          const user = useAuthStore.getState().user;
          if (!user?.id) {
            Alert.alert('Error', 'User not authenticated');
            return;
          }
          
          // Generate unique filename
          const timestamp = Date.now();
          const fileExtension = asset.uri.split('.').pop() || 'jpg';
          const fileName = `avatar_${timestamp}_${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
          
          console.log('Uploading photo to Supabase bucket...');
          const publicUrl = await storageService.uploadAvatar(user.id, asset.uri, fileName);
          console.log('Upload successful, public URL:', publicUrl);
          
          // Update photos array with Supabase URL
          const newPhotos = [...photos];
          newPhotos[index] = publicUrl;
          console.log('Updated photos array:', newPhotos);
          onPhotosChange(newPhotos);
          
          // Animate photo addition
          Animated.sequence([
            Animated.timing(animatedValues[index], {
              toValue: 0.8,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValues[index], {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();

          logEvent(Events.PHOTO_UPLOADED, { photoIndex: index, bucketUpload: true });
        } catch (uploadError) {
          console.error('Failed to upload to Supabase:', uploadError);
          Alert.alert('Upload Error', 'Failed to upload photo to cloud storage. Please try again.');
          logEvent(Events.PHOTO_UPLOADED, { 
            photoIndex: index, 
            error: String(uploadError),
            bucketUpload: false 
          });
        }
      }
    } catch (error) {
      Alert.alert('Error', t('photo.selectError'));
      logEvent(Events.PHOTO_UPLOADED, { photoIndex: index, error: String(error) });
    }
  };

  const handleDeletePhoto = (index: number) => {
    Alert.alert(
      t('photos.delete_confirm'),
      '',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('photo.delete'),
          style: 'destructive',
          onPress: () => {
            // Animate photo removal
            Animated.timing(animatedValues[index], {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start(() => {
              const newPhotos = [...photos];
              newPhotos[index] = null;
              onPhotosChange(newPhotos);
              
              // Reset animation value
              animatedValues[index].setValue(1);
            });

            logEvent(Events.PHOTO_UPLOADED, { photoIndex: index, action: 'deleted' });
          },
        },
      ]
    );
  };

  const handlePhotoTap = (index: number) => {
    if (!isReorderMode) return;

    if (selectedForSwap === null) {
      // First photo selected
      setSelectedForSwap(index);
    } else if (selectedForSwap === index) {
      // Same photo tapped, deselect
      setSelectedForSwap(null);
    } else {
      // Second photo selected, perform swap
      const newPhotos = [...photos];
      const temp = newPhotos[selectedForSwap];
      newPhotos[selectedForSwap] = newPhotos[index];
      newPhotos[index] = temp;
      
      onPhotosChange(newPhotos);
      setSelectedForSwap(null);
      setIsReorderMode(false);
      
      logEvent(Events.PHOTO_UPLOADED, { 
        action: 'reordered',
        fromIndex: selectedForSwap,
        toIndex: index 
      });
    }
  };

  const toggleReorderMode = () => {
    setIsReorderMode(!isReorderMode);
    setSelectedForSwap(null);
  };

  const renderPhotoSlot = (index: number) => {
    const photo = photos[index];
    const isSelected = selectedForSwap === index;
    
    const animatedStyle = {
      transform: [
        {
          scale: animatedValues[index],
        },
      ],
    };

    return (
      <Animated.View key={index} style={[styles.photoSlot, animatedStyle]}>
        <TouchableOpacity
          style={[
            styles.photoContainer,
            isSelected && styles.selectedPhotoContainer,
            isReorderMode && styles.reorderModeContainer,
          ]}
          onPress={() => {
            if (isReorderMode) {
              handlePhotoTap(index);
            } else if (photo) {
              // Show photo options or do nothing
            } else {
              handleAddPhoto(index);
            }
          }}
          activeOpacity={0.8}
        >
          {photo ? (
            <>
              <Image 
                source={{ uri: photo }} 
                style={styles.photo}
                resizeMode="cover"
                onError={(error) => {
                  console.error('Image load error:', error);
                  console.log('Failed to load image URL:', photo);
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', photo);
                }}
              />
              {!isReorderMode && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeletePhoto(index)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons 
                    name="close-circle" 
                    size={24} 
                    color={theme.colors.status.error} 
                  />
                </TouchableOpacity>
              )}
              {isSelected && (
                <View style={styles.selectedOverlay}>
                  <Typography variant="caption" color={theme.colors.text.inverse}>
                    1
                  </Typography>
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptySlot}>
              <Ionicons 
                name="add" 
                size={32} 
                color={theme.colors.text.tertiary} 
              />
              <Typography 
                variant="caption" 
                color={theme.colors.text.tertiary}
                style={styles.addText}
              >
                {t('photos.add')}
              </Typography>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          
          <Typography variant="h3" color={theme.colors.text.primary}>
            {t('photo.addPhoto')}
          </Typography>
          
          <TouchableOpacity onPress={toggleReorderMode} style={styles.editButton}>
            <Typography variant="caption" color={theme.colors.secondary.main}>
              {isReorderMode ? t('common.done') : 'Edit Order'}
            </Typography>
          </TouchableOpacity>
        </View>

        {isReorderMode && (
          <View style={styles.reorderInstructions}>
            <Typography variant="caption" color={theme.colors.text.secondary}>
              Tap two photos to swap their positions
            </Typography>
          </View>
        )}

        <View style={styles.photosContainer}>
          <View style={styles.photosGrid}>
            {Array.from({ length: maxPhotos }, (_, index) => renderPhotoSlot(index))}
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={onClose}
          >
            {t('common.done')}
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  editButton: {
    padding: theme.spacing.xs,
  },
  reorderInstructions: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface.secondary,
    alignItems: 'center',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  photoSlot: {
    width: '31%',
    aspectRatio: 1,
  },
  photoContainer: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedPhotoContainer: {
    borderWidth: 3,
    borderColor: theme.colors.primary.main,
  },
  reorderModeContainer: {
    opacity: 0.8,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: theme.colors.background.primary,
    borderRadius: 12,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlot: {
    flex: 1,
    backgroundColor: theme.colors.surface.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border.secondary,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.md,
  },
  addText: {
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  photosContainer: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
  },
});
