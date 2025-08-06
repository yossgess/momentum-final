import * as Location from 'expo-location';
import { supabase } from '../../config/supabase';
import { useAuthStore } from '../stores/authStore';
import { logEvent } from '../utils/analytics';

export interface LocationData {
  lat: number;
  lng: number;
}

export class LocationService {
  /**
   * Request location permissions from the user
   */
  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      logEvent('location_permission_requested', { status });
      
      return status === 'granted';
    } catch (error) {
      console.error('Failed to request location permission:', error);
      logEvent('location_permission_error', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      return false;
    }
  }

  /**
   * Get current user location
   */
  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      // Check if we have permission
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.warn('Location permission not granted');
        return null;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
      });

      const locationData: LocationData = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };

      logEvent('location_captured', { ...locationData });
      
      return locationData;
    } catch (error) {
      console.error('Failed to get current location:', error);
      logEvent('location_capture_failed', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      return null;
    }
  }

  /**
   * Update user's location in the profiles table
   */
  async updateUserLocation(userId: string, location: LocationData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          lat: location.lat,
          lng: location.lng,
          // Note: profiles table uses created_at, not updated_at
        })
        .eq('id', userId);

      if (error) {
        console.error('Failed to update user location in database:', error);
        throw error;
      }

      logEvent('location_updated_in_database', {
        userId,
        lat: location.lat,
        lng: location.lng,
      });

      console.log('User location updated successfully in database');
      return true;
    } catch (error) {
      console.error('Failed to update user location:', error);
      logEvent('location_update_failed', { 
        userId,
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      return false;
    }
  }

  /**
   * Request location permission and update user location
   */
  async requestLocationAndUpdate(): Promise<boolean> {
    const { user } = useAuthStore.getState();
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }

    try {
      // Request permission
      const hasPermission = await this.requestLocationPermission();
      
      if (!hasPermission) {
        console.warn('Location permission denied by user');
        return false;
      }

      // Get current location
      const location = await this.getCurrentLocation();
      
      if (!location) {
        console.warn('Failed to get current location');
        return false;
      }

      // Update location in database
      const success = await this.updateUserLocation(user.id, location);
      
      if (success) {
        logEvent('location_setup_completed', {
          userId: user.id,
          lat: location.lat,
          lng: location.lng,
        });
      }

      return success;
    } catch (error) {
      console.error('Failed to request location and update:', error);
      logEvent('location_setup_failed', { 
        userId: user.id,
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      return false;
    }
  }

  /**
   * Check if user has location data in their profile
   */
  async checkUserHasLocation(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('lat, lng')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Failed to check user location:', error);
        return false;
      }

      const hasLocation = data?.lat !== null && data?.lng !== null;
      
      logEvent('location_check', {
        userId,
        hasLocation,
        lat: data?.lat,
        lng: data?.lng,
      });

      return hasLocation;
    } catch (error) {
      console.error('Failed to check user location:', error);
      return false;
    }
  }
}

export const locationService = new LocationService();
