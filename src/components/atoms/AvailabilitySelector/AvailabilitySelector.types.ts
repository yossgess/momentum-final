export interface AvailabilityData {
  days: string[];
  periods: string[];
  slots?: string[]; // New: individual slot selections like ["monday-morning", "tuesday-evening"]
}

export interface AvailabilitySelectorProps {
  availability: AvailabilityData;
  onChange?: (availability: AvailabilityData) => void;
  mode?: 'edit' | 'display';
  testID?: string;
}
