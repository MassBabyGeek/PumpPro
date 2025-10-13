/**
 * PhysicalInfoForm Component
 *
 * Form section for physical information (age, weight, height)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FormInput from './FormInput';
import appColors from '../../../assets/colors';

interface PhysicalInfoFormProps {
  age: string;
  weight: string;
  height: string;
  onAgeChange: (text: string) => void;
  onWeightChange: (text: string) => void;
  onHeightChange: (text: string) => void;
  errors: Record<string, string>;
}

const PhysicalInfoForm: React.FC<PhysicalInfoFormProps> = ({
  age,
  weight,
  height,
  onAgeChange,
  onWeightChange,
  onHeightChange,
  errors,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Informations physiques</Text>

      <FormInput
        label="Âge (ans)"
        value={age}
        onChangeText={onAgeChange}
        placeholder="25"
        error={errors.age}
        keyboardType="number-pad"
        maxLength={3}
      />

      <FormInput
        label="Poids (kg)"
        value={weight}
        onChangeText={onWeightChange}
        placeholder="75"
        error={errors.weight}
        keyboardType="decimal-pad"
        maxLength={5}
      />

      <FormInput
        label="Taille (cm)"
        value={height}
        onChangeText={onHeightChange}
        placeholder="180"
        error={errors.height}
        keyboardType="number-pad"
        maxLength={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 15,
  },
});

export default PhysicalInfoForm;
