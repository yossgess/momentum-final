export interface Event {
  id: string;
  title: string;
  dateTime: Date;
  location: string;
  image?: string;
  sportType?: string;
  participants?: {
    current: number;
    max: number;
  };
}

export interface EventCardProps {
  event: Event;
  onPress: (eventId: string) => void;
  style?: any;
}
