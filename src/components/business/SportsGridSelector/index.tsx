import React from 'react';
import { View, FlatList } from 'react-native';
import { Typography } from '../../atoms/Typography';
import { SportsGridSelectorProps, Sport } from './SportsGridSelector.types';
import { styles } from './SportsGridSelector.styles';
import { SportChip } from '../SportChip';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const SportsGridSelector: React.FC<SportsGridSelectorProps> = ({
  sports,
  selected,
  onSelect,
  onDeselect,
  maxSelectable,
  multiSelect = true,
  title,
  style,
}) => {
  const handleSportPress = (sport: Sport) => {
    const isSelected = selected.includes(sport.id);
    
    if (isSelected) {
      logEvent(Events.SPORT_DESELECTED, { sportId: sport.id, sportName: sport.name });
      onDeselect(sport.id);
    } else {
      if (maxSelectable && selected.length >= maxSelectable && multiSelect) {
        return;
      }
      logEvent(Events.SPORT_SELECTED, { sportId: sport.id, sportName: sport.name });
      onSelect(sport.id);
    }
  };

  const renderSport = ({ item }: { item: Sport }) => (
    <SportChip
      sport={item}
      selected={selected.includes(item.id)}
      onPress={() => handleSportPress(item)}
      style={styles.sportChip}
    />
  );

  return (
    <View style={[styles.container, style]}>
      {title && (
        <Typography variant="h3" color="primary" style={styles.title}>
          {title}
        </Typography>
      )}
      
      <FlatList
        data={sports}
        renderItem={renderSport}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      />
      
      {maxSelectable && multiSelect && (
        <Typography variant="caption" color="secondary" style={styles.counter}>
          {selected.length}/{maxSelectable} selected
        </Typography>
      )}
    </View>
  );
};
