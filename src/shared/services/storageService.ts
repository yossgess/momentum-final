import { supabase } from '../../config/supabase';
import { logEvent, Events } from '../utils/analytics';

export class StorageService {
  private bucketName = 'user-avatars';

  async uploadAvatar(userId: string, uri: string, fileName: string): Promise<string> {
    try {
      console.log('Attempting to upload avatar for user:', userId, 'file:', fileName);
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const filePath = `${userId}/${fileName}`;
      
      console.log('Uploading to storage bucket:', this.bucketName, 'path:', filePath);
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Storage upload error [storage.upload]:', error);
        throw error;
      }

      console.log('Getting public URL for uploaded file...');
      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      console.log('Avatar upload successful, public URL:', urlData.publicUrl);
      logEvent(Events.PHOTO_UPLOADED, { userId, filePath });
      return urlData.publicUrl;
    } catch (error) {
      console.error('Avatar upload error details [storage.upload]:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  async deleteAvatar(userId: string, fileName: string): Promise<void> {
    const filePath = `${userId}/${fileName}`;
    
    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove([filePath]);

    if (error) throw error;
    logEvent(Events.PHOTO_DELETED, { userId, filePath });
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
