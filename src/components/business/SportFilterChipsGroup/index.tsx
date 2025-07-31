import React, { useState } from 'react';
import { View, ScrollView, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';
import { SportChip } from '../SportChip';
import { SportFilterChipsGroupProps } from './SportFilterChipsGroup.types';
import { styles } from './SportFilterChipsGroup.styles';
import { t } from '../../../shared/utils/i18n';
import { categorizedSports } from '../../../constants/sports';
import { getSportIcon, categoryIconMap } from '../../../constants/sportIcons';
import { theme } from '../../../theme';

export const SportFilterChipsGroup: React.FC<SportFilterChipsGroupProps> = ({
  selectedFilters,
  onChange,
  title,
  showClearAll = true,
  showSelectAll = false,
  style,
}) => {
  // Generate all available sports from categorized sports
  const allSports = Object.values(categorizedSports).flat();
  
  // State for collapsible categories
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.keys(categorizedSports).reduce((acc, category) => ({ ...acc, [category]: true }), {})
  );
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSportToggle = (sportName: string) => {
    const isSelected = selectedFilters.includes(sportName);
    if (isSelected) {
      onChange(selectedFilters.filter(name => name !== sportName));
    } else {
      onChange([...selectedFilters, sportName]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const handleSelectAll = () => {
    onChange(allSports);
  };

  return (
    <View style={[styles.container, style]}>
      {title && (
        <View style={styles.header}>
          <Typography variant="body" color="primary" weight="medium">
            {title}
          </Typography>
          
          <View style={styles.actions}>
            {showSelectAll && (
              <Button
                variant="ghost"
                size="sm"
                onPress={handleSelectAll}
                disabled={selectedFilters.length === allSports.length}
              >
                {t('common.selectAll')}
              </Button>
            )}
            
            {showClearAll && selectedFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onPress={handleClearAll}
              >
                {t('common.clear')}
              </Button>
            )}
          </View>
        </View>
      )}
      
      {/* Select All / Clear All Actions */}
      <View style={styles.actionsContainer}>
        <Button
          variant={selectedFilters.length === allSports.length ? "secondary" : "primary"}
          size="sm"
          onPress={() => {
            if (selectedFilters.length === allSports.length) {
              onChange([]);
            } else {
              onChange(allSports);
            }
          }}
          style={styles.selectAllButton}
        >
          {selectedFilters.length === allSports.length ? t('common.clear') : t('common.selectAll')}
        </Button>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        
        {/* Categorized Sports */}
        {Object.entries(categorizedSports).map(([category, sports]) => {
          const isExpanded = expandedCategories[category];
          const selectedInCategory = sports.filter(sport => selectedFilters.includes(sport)).length;
          
          return (
            <View key={category} style={styles.categoryContainer}>
              <Pressable 
                style={[
                  styles.categoryHeader,
                  isExpanded && styles.categoryHeaderExpanded
                ]}
                onPress={() => toggleCategory(category)}
              >
                <View style={styles.categoryTitleRow}>
                  <Typography 
                    variant="h4" 
                    color="primary" 
                    weight="semibold" 
                    style={styles.categoryTitleText}
                  >
                    {categoryIconMap[category]} {t(`sports.categories.${category}`)}
                  </Typography>
                  
                  {selectedInCategory > 0 && (
                    <View style={styles.categoryBadge}>
                      <Typography variant="caption" style={styles.categoryBadgeText}>
                        {selectedInCategory}
                      </Typography>
                    </View>
                  )}
                </View>
                
                <Ionicons 
                  name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color={theme.colors.text.secondary}
                />
              </Pressable>
              
              {isExpanded && (
                <View style={styles.categoryChipsContainer}>
                  {sports.map((sportName) => (
                    <SportChip
                      key={sportName}
                      sport={{
                        id: sportName.toLowerCase(),
                        name: t(`sports.${sportName}`) || sportName,
                        icon: getSportIcon(sportName)
                      }}
                      selected={selectedFilters.includes(sportName)}
                      onPress={() => handleSportToggle(sportName)}
                      size="sm"
                      style={styles.chip}
                    />
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
      
      {selectedFilters.length > 0 && (
        <View style={styles.counter}>
          <Typography variant="body" style={styles.counterText}>
            {selectedFilters.length} sport{selectedFilters.length !== 1 ? 's' : ''} selected
          </Typography>
        </View>
      )}
    </View>
  );
};
