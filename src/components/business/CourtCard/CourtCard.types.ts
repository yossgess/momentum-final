export interface Court {
  id: string;
  courtName: string;
  type: string;
  location: string;
  image?: string;
}

export interface CourtCardProps {
  court: Court;
  onPress: (courtId: string) => void;
  style?: any;
}
