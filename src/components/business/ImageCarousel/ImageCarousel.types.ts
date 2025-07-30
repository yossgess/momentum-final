export interface ImageCarouselProps {
  images: string[];
  onImagePress?: (index: number) => void;
  style?: any;
}
