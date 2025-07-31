export interface ImageCarouselProps {
  images: string[];
  onImagePress?: (index: number) => void;
  onIndexChange?: (index: number) => void;
  style?: any;
}
