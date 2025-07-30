export interface Coach {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  avatarImage?: string;
  available?: boolean;
}

export interface CoachCardProps {
  coach: Coach;
  onPress: (coachId: string) => void;
  style?: any;
}
