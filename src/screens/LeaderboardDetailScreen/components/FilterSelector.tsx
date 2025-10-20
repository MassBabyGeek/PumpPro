import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';

type Option = {value: string; label: string; icon?: string};

type Props = {
  label: string;
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
};

const FilterSelector = ({label, options, selected, onSelect}: Props) => {
  return (
    <View style={{paddingTop: 16, paddingBottom: 8}}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
          color: appColors.textSecondary,
          marginBottom: 8,
        }}>
        {label}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{gap: 8}}>
        {options.map(option => {
          const active = selected === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: active
                  ? appColors.primary
                  : `${appColors.border}30`,
                borderWidth: 1,
                borderColor: active ? appColors.primary : appColors.border,
              }}>
              {option.icon && (
                <Icon
                  name={option.icon}
                  size={16}
                  color={active ? '#fff' : appColors.textSecondary}
                />
              )}
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: active ? '600' : '500',
                  color: active ? '#fff' : appColors.textSecondary,
                }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default FilterSelector;
