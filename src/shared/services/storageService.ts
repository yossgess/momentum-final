import { supabase } from '../../config/supabase';
import { logEvent, Events } from '../utils/analytics';

export class StorageService {
  private bucketName = 'user-avatars';

  async uploadAvatar(userId: string, uri: string, fileName: string): Promise<string> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const filePath = `${userId}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      logEvent(Events.PHOTO_UPLOADED, { userId, filePath });
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
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
