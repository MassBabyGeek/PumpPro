import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

const SearchBar = ({value, onChangeText}: SearchBarProps) => {
  return (
    <View style={styles.searchContainer}>
      <Icon
        name="search"
        size={20}
        color={appColors.textSecondary}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un challenge..."
        placeholderTextColor={appColors.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <Icon
          name="close-circle"
          size={20}
          color={appColors.textSecondary}
          onPress={() => onChangeText('')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${appColors.textSecondary}20`,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: `${appColors.textSecondary}30`,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: appColors.textPrimary,
    paddingVertical: 12,
  },
});

export default SearchBar;
