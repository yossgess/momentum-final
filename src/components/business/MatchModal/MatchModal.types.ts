export interface MatchUser {
  id: string;
  name: string;
  image: string;
}

export interface MatchModalProps {
  visible: boolean;
  currentUser: MatchUser;
  matchedUser: MatchUser;
  onSendMessage: () => void;
  onKeepSwiping: () => void;
  onClose: () => void;
}
