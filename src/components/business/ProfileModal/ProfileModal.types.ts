import { ProfileRow } from '../../../shared/types/database';

export interface ProfileModalProps {
  visible: boolean;
  profile: ProfileRow | null;
  onClose: () => void;
  onChallenge: () => void;
  onNope: () => void;
  onRevert: () => void;
  canRevert?: boolean;
  isLoading?: boolean;
}

export interface ProfileModalProfile {
  id: string;
  name: string;
  age: number;
  bio?: string;
  images: string[];
  sports: Array<{ name: string; icon: string }>;
  sharedSports: Array<{ name: string; icon: string }>;
  location: string;
  distanceInKm?: number;
  availability?: string[];
}
