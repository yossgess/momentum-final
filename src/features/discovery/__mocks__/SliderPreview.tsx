import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../../components/atoms/Typography';
import { DistanceSlider, AgeRangeSlider } from '../../../components/molecules/FilterSlider';
import { theme } from '../../../theme';

export const SliderPreview: React.FC = () => {
  const [distance, setDistance] = useState(25);
  const [ageRange, setAgeRange] = useState<[number, number]>([22, 35]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Typography variant="h2" color="primary" style={styles.title}>
          Filter Slider Components
        </Typography>
        
        <View style={styles.section}>
          <Typography variant="h3" color="primary" style={styles.sectionTitle}>
            Distance Slider
          </Typography>
          <Typography variant="body" color="secondary" style={styles.description}>
            Single thumb slider for search radius (10-100km)
          </Typography>
          <DistanceSlider
            value={distance}
            onValueChange={setDistance}
            min={10}
            max={100}
            step={1}
            unit="km"
          />
          <Typography variant="caption" color="tertiary" style={styles.valueDisplay}>
            Current value: {distance} km
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" color="primary" style={styles.sectionTitle}>
            Age Range Slider
          </Typography>
          <Typography variant="body" color="secondary" style={styles.description}>
            Dual thumb slider for age range (18-65+)
          </Typography>
          <AgeRangeSlider
            values={ageRange}
            onValuesChange={setAgeRange}
            min={18}
            max={65}
            step={1}
            unit="years"
          />
          <Typography variant="caption" color="tertiary" style={styles.valueDisplay}>
            Current range: {ageRange[0]} - {ageRange[1] === 65 ? '65+' : ageRange[1]} years
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" color="primary" style={styles.sectionTitle}>
            Custom Range Examples
          </Typography>
          
          <Typography variant="body" color="secondary" style={styles.description}>
            Distance Slider (5-50km, step 5)
          </Typography>
          <DistanceSlider
            value={20}
            onValueChange={() => {}}
            min={5}
            max={50}
            step={5}
            unit="km"
          />
          
          <Typography variant="body" color="secondary" style={styles.description}>
            Age Range Slider (21-40, step 1)
          </Typography>
          <AgeRangeSlider
            values={[25, 32]}
            onValuesChange={() => {}}
            min={21}
            max={40}
            step={1}
            unit="years"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface.primary,
    borderRadius: 12,
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    marginBottom: theme.spacing.sm,
  },
  description: {
    marginBottom: theme.spacing.md,
  },
  valueDisplay: {
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    fontWeight: '600',
  },
});
