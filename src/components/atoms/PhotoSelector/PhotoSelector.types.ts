export interface PhotoData {
  uri: string;
  id: string;
}

export interface PhotoSelectorProps {
  photos?: PhotoData[];
  mainPhotoIndex?: number;
  onPhotosChange: (photos: PhotoData[]) => void;
  onMainPhotoChange: (index: number) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  maxImages?: number;
  style?: any;
}
