import React from 'react';
import { View, ScrollView } from 'react-native';
import { Typography } from '../../atoms/Typography';
import { Tag } from '../../atoms/Tag';
import { FiltersChipGroupProps } from './FiltersChipGroup.types';
import { styles } from './FiltersChipGroup.styles';

export const FiltersChipGroup: React.FC<FiltersChipGroupProps> = ({
  filters,
  selectedFilters,
  onFilterToggle,
  title,
  horizontal = true,
  style,
}) => {
  const handleFilterPress = (filterId: string) => {
    onFilterToggle(filterId);
  };

  if (horizontal) {
    return (
      <View style={[styles.container, style]}>
        {title && (
          <Typography variant="body" color="primary" weight="medium" style={styles.title}>
            {title}
          </Typography>
        )}
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
          <View style={styles.horizontalContainer}>
            {filters.map((filter) => (
              <Tag
                key={filter.id}
                label={filter.label}
                variant={selectedFilters.includes(filter.id) ? 'filled' : 'outlined'}
                onPress={() => handleFilterPress(filter.id)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {title && (
        <Typography variant="body" color="primary" weight="medium" style={styles.title}>
          {title}
        </Typography>
      )}
      
      <View style={styles.verticalContainer}>
        {filters.map((filter) => (
          <Tag
            key={filter.id}
            label={filter.label}
            variant={selectedFilters.includes(filter.id) ? 'filled' : 'outlined'}
            onPress={() => handleFilterPress(filter.id)}
          />
        ))}
      </View>
    </View>
  );
};
