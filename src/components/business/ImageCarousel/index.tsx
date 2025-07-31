import React, { useState } from 'react';
import { View, FlatList, Image, Dimensions, Pressable } from 'react-native';
import { ImageCarouselProps } from './ImageCarousel.types';
import { styles } from './ImageCarousel.styles';
import { logEvent } from '../../../shared/utils/analytics';
import { DotPaginationIndicator } from '../DotPaginationIndicator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  onImagePress,
  onIndexChange,
  style,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateIndex = (event: any, source: string, shouldLog: boolean = false) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.round(contentOffset.x / viewSize.width);
    
    if (pageNum !== currentIndex && pageNum >= 0 && pageNum < images.length) {
      setCurrentIndex(pageNum);
      onIndexChange?.(pageNum);
      
      // Only log analytics and debug info for final scroll events
      if (shouldLog) {
        console.log(`ImageCarousel ${source} - Updated index from`, currentIndex, 'to', pageNum);
        logEvent('image_swiped', { index: pageNum });
      }
    }
  };

  const handleScroll = (event: any) => {
    // Real-time index update for immediate visual feedback
    updateIndex(event, 'onScroll', false);
  };

  const handleMomentumScrollEnd = (event: any) => {
    // Final index confirmation with logging
    updateIndex(event, 'onMomentumScrollEnd', true);
  };

  const handleScrollEndDrag = (event: any) => {
    // Final index confirmation with logging
    updateIndex(event, 'onScrollEndDrag', true);
  };

  const renderImage = ({ item, index }: { item: string; index: number }) => (
    <Pressable
      onPress={() => onImagePress?.(index)}
      style={[styles.imageContainer, { width: SCREEN_WIDTH }]}
    >
      <Image
        source={{ uri: item }}
        style={styles.image}
        resizeMode="cover"
      />
    </Pressable>
  );

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={16}
        style={styles.scrollView}
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
      />

      <DotPaginationIndicator
        total={images.length}
        currentIndex={currentIndex}
        style={styles.indicators}
      />
    </View>
  );
};
