export interface ChatBubbleProps {
  message: string;
  timestamp: Date;
  isSender: boolean;
  status?: 'sent' | 'delivered' | 'read';
}
