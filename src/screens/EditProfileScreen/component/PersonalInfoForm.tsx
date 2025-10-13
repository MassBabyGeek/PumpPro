/**
 * PersonalInfoForm Component
 *
 * Form section for personal information (name, email, goal)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FormInput from './FormInput';
import appColors from '../../../assets/colors';

interface PersonalInfoFormProps {
  name: string;
  email: string;
  goal: string;
  onNameChange: (text: string) => void;
  onEmailChange: (text: string) => void;
  onGoalChange: (text: string) => void;
  errors: Record<string, string>;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  name,
  email,
  goal,
  onNameChange,
  onEmailChange,
  onGoalChange,
  errors,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Informations personnelles</Text>

      <FormInput
        label="Nom"
        value={name}
        onChangeText={onNameChange}
        placeholder="Votre nom"
        error={errors.name}
        required
        autoCapitalize="words"
      />

      <FormInput
        label="Email"
        value={email}
        onChangeText={onEmailChange}
        placeholder="votre@email.com"
        error={errors.email}
        required
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <FormInput
        label="Objectif"
        value={goal}
        onChangeText={onGoalChange}
        placeholder="Ex: Atteindre 100 pompes d'affilée"
        multiline
        numberOfLines={2}
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

export default PersonalInfoForm;
