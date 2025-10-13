/**
 * EditProfileHeader Component
 *
 * Header with back button, title, and placeholder for symmetry
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';

interface EditProfileHeaderProps {
  onBack: () => void;
}

const EditProfileHeader: React.FC<EditProfileHeaderProps> = ({ onBack }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color={appColors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.title}>Modifier le profil</Text>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
});

export default EditProfileHeader;
