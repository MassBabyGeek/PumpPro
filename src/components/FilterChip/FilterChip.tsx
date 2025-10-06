import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: string;
}

const FilterChip: React.FC<FilterChipProps> = ({
  label,
  selected,
  onPress,
  icon,
}) => {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.7}>
      {icon && (
        <Icon
          name={icon}
          size={16}
          color={selected ? appColors.background : appColors.textSecondary}
        />
      )}
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: `${appColors.textSecondary}20`,
    borderWidth: 1,
    borderColor: `${appColors.textSecondary}30`,
  },
  chipSelected: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  label: {
    fontSize: 13,
    color: appColors.textSecondary,
    fontWeight: '600',
  },
  labelSelected: {
    color: appColors.background,
  },
});

export default FilterChip;
