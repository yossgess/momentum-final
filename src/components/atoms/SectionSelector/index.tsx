import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SectionSelectorProps } from './SectionSelector.types';
import { styles } from './SectionSelector.styles';
import { logEvent, Events } from '../../../shared/utils/analytics';

export const SectionSelector: React.FC<SectionSelectorProps> = ({
  sections,
  selectedIndex,
  onSelectionChange,
  disabled = false,
}) => {
  const handleSectionPress = (index: number) => {
    if (!disabled && index !== selectedIndex) {
      logEvent(Events.SECTION_SELECTED, { 
        section: sections[index], 
        index,
        previousIndex: selectedIndex 
      });
      onSelectionChange(index);
    }
  };

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      {sections.map((section, index) => (
        <Pressable
          key={index}
          style={[
            styles.section,
            index === selectedIndex && styles.selectedSection,
          ]}
          onPress={() => handleSectionPress(index)}
          disabled={disabled}
        >
          <Text
            style={[
              styles.sectionText,
              index === selectedIndex && styles.selectedSectionText,
            ]}
          >
            {section}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
