import { UserProfile } from '../../../shared/stores/userStore';

export interface MatchModalProps {
  visible: boolean;
  currentUser: UserProfile;
  matchedUser: UserProfile;
  onSendMessage: () => void;
  onKeepSwiping: () => void;
  onClose: () => void;
}
