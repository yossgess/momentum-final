import { supabase } from '../../config/supabase';
import { logEvent, Events } from '../utils/analytics';
import * as FileSystem from 'expo-file-system';

export class StorageService {
  private bucketName = 'user-avatars';

  async uploadAvatar(userId: string, uri: string, fileName: string): Promise<string> {
    try {
      console.log('Attempting to upload avatar for user:', userId, 'file:', fileName);
      console.log('Source URI:', uri);
      
      // Create user-specific folder path
      const filePath = `${userId}/${fileName}`;
      
      console.log('Uploading to storage bucket:', this.bucketName, 'path:', filePath);
      
      // Read file as base64 and convert to ArrayBuffer for proper upload
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Convert base64 to ArrayBuffer
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      console.log('File data prepared, size:', bytes.length, 'bytes');
      
      // Upload ArrayBuffer to Supabase
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, bytes.buffer, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/jpeg',
        });

      if (error) {
        console.error('Storage upload error [storage.upload]:', error);
        throw new Error(`Failed to upload photo: ${error.message}`);
      }

      console.log('Upload successful, getting public URL...');
      
      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) {
        throw new Error('Failed to get public URL for uploaded photo');
      }

      console.log('Avatar upload successful, public URL:', urlData.publicUrl);
      logEvent(Events.PHOTO_UPLOADED, { userId, filePath, bucketName: this.bucketName });
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Avatar upload error details [storage.upload]:', JSON.stringify(error, null, 2));
      logEvent(Events.PHOTO_UPLOADED, { 
        userId, 
        fileName, 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      });
      throw error;
    }
  }

  async deleteAvatar(userId: string, fileName: string): Promise<void> {
    try {
      const filePath = `${userId}/${fileName}`;
      
      console.log('Deleting avatar from bucket:', this.bucketName, 'path:', filePath);
      
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Storage delete error:', error);
        throw new Error(`Failed to delete photo: ${error.message}`);
      }

      console.log('Avatar deleted successfully:', filePath);
      logEvent(Events.PHOTO_DELETED, { userId, filePath, bucketName: this.bucketName });
    } catch (error) {
      console.error('Avatar delete error:', error);
      throw error;
    }
  }

  async listUserAvatars(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list(userId);

      if (error) {
        console.error('Storage list error:', error);
        throw new Error(`Failed to list user photos: ${error.message}`);
      }

      return data?.map(file => this.getAvatarUrl(userId, file.name)) || [];
    } catch (error) {
      console.error('List avatars error:', error);
      throw error;
    }
  }

  getAvatarUrl(userId: string, fileName: string): string {
    const filePath = `${userId}/${fileName}`;
    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }
}

export const storageService = new StorageService();
