import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Image as ExpoImage } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useNavigation } from '@react-navigation/native';
import { Typography } from '../../../components/atoms/Typography';
import { Button } from '../../../components/atoms/Button';
import { theme } from '../../../theme';
import { t } from '../../../shared/utils/i18n';
import { onboardingSlides } from '../data/onboardingSlides';
import { logEvent, Events } from '../../../shared/utils/analytics';
import { useOnboardingStore } from '../../onboarding/store/onboardingStore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const OnboardingSlider: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const navigation = useNavigation();
  const { markOnboardingAsSeen } = useOnboardingStore();

  useEffect(() => {
    // Log onboarding started
    logEvent(Events.ONBOARDING_STARTED, {
      totalSlides: onboardingSlides.length,
    });

    // Note: Skipping image prefetch for local assets as they're already bundled
    // ExpoImage.prefetch is only needed for remote URLs, not local require() assets
    console.log('Onboarding slides loaded with local assets - no prefetch needed');
  }, []);

  const handleNext = () => {
    if (currentPage < onboardingSlides.length - 1) {
      const nextPage = currentPage + 1;
      pagerRef.current?.setPage(nextPage);
      setCurrentPage(nextPage);
      
      logEvent(Events.ONBOARDING_NEXT, {
        currentSlide: currentPage,
        nextSlide: nextPage,
      });
    }
  };

  const handleGetStarted = () => {
    logEvent(Events.ONBOARDING_COMPLETED, {
      totalSlides: onboardingSlides.length,
    });
    
    // Mark onboarding as seen
    markOnboardingAsSeen();
    
    // Navigation will happen automatically due to conditional rendering
    // When hasSeenOnboarding becomes true, AppNavigator will show Auth flow
  };

  const handlePageSelected = (event: any) => {
    const newPage = event.nativeEvent.position;
    setCurrentPage(newPage);
  };

  const handlePageScrollStateChanged = (event: any) => {
    // This ensures immediate visual feedback during swipe gestures
    const state = event.nativeEvent.pageScrollState;
    if (state === 'idle') {
      // Force re-render when scroll completes
      setCurrentPage(prev => prev);
    }
  };

  const renderPaginationDots = () => {
    return (
      <View style={styles.paginationContainer}>
        {onboardingSlides.map((_, index) => {
          const isActive = index === currentPage;
          return (
            <TouchableOpacity
              key={`dot-${index}`}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: isActive
                    ? theme.colors.primary.main
                    : theme.colors.secondary[300],
                  transform: [{ scale: isActive ? 1.2 : 1 }],
                },
              ]}
              onPress={() => {
                setCurrentPage(index);
                pagerRef.current?.setPage(index);
              }}
              activeOpacity={0.7}
            />
          );
        })}
      </View>
    );
  };

  const renderSlide = (slide: typeof onboardingSlides[0], index: number) => {
    return (
      <View key={index} style={styles.slideContainer}>
        <View style={styles.imageContainer}>
          <ExpoImage
            source={slide.image}
            style={styles.illustration}
            resizeMode="cover"
          />
          <View style={styles.darkOverlay} />
        </View>
        
        <View style={styles.contentContainer}>
          <Typography
            variant="h1"
            color="primary"
            align="center"
            style={styles.title}
          >
            {t(slide.titleKey)}
          </Typography>
          
          <Typography
            variant="body"
            color="primary"
            align="center"
            style={styles.subtitle}
          >
            {t(slide.subtitleKey)}
          </Typography>
        </View>
      </View>
    );
  };

  const isLastSlide = currentPage === onboardingSlides.length - 1;

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={handlePageSelected}
        onPageScrollStateChanged={handlePageScrollStateChanged}
        pageMargin={0}
        overdrag={false}
      >
        {onboardingSlides.map((slide, index) => renderSlide(slide, index))}
      </PagerView>

      <View style={styles.topOverlay}>
        {renderPaginationDots()}
      </View>
      
      <View style={styles.bottomOverlay}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={isLastSlide ? handleGetStarted : handleNext}
          label={t(isLastSlide ? 'onboarding.ctaStart' : 'onboarding.ctaNext')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  pagerView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: screenWidth,
    height: screenHeight,
    position: 'absolute',
  },
  contentContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: [{ translateY: -50 }],
    zIndex: 2,
    backgroundColor: 'transparent',
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  subtitle: {
    paddingHorizontal: theme.spacing.md,
    lineHeight: 24,
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  },
  topOverlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 10,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    backgroundColor: 'transparent',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: theme.spacing.xs,
  },

});
