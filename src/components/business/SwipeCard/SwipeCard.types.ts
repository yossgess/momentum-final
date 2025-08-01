export interface Sport {
  id: string;
  name: string;
  icon: string;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  images: string[];
  location: string;
  bio?: string;
  sports?: Sport[];
  sharedSports?: Sport[];
  skillLevel?: string;
  distanceInKm?: number; // Distance in kilometers
}

export interface SwipeCardProps {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onPressImage?: (imageIndex: number) => void;
  style?: any;
  fullScreen?: boolean; // Enable full-screen mode for DiscoveryScreen
}
