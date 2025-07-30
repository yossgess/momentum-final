import React, { useState } from 'react';
import { View, ScrollView, Image, Dimensions } from 'react-native';
import { ImageCarouselProps } from './ImageCarousel.types';
import { styles } from './ImageCarousel.styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  onImagePress,
  style,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentIndex(pageNum);
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={[styles.image, { width: SCREEN_WIDTH - 32 }]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      <View style={styles.indicators}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
};
