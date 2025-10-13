/**
 * FormInput Component
 *
 * Reusable form input component with label, error handling, and required indicator
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import appColors from '../../../assets/colors';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  required = false,
  keyboardType = 'default',
  maxLength,
  multiline = false,
  numberOfLines,
  autoCapitalize = 'sentences',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          multiline && styles.inputMultiline,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={appColors.textSecondary}
        keyboardType={keyboardType}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoCapitalize={autoCapitalize}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.textSecondary,
    marginBottom: 8,
  },
  required: {
    color: appColors.danger,
  },
  input: {
    backgroundColor: appColors.backgroundLight,
    borderWidth: 1,
    borderColor: appColors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: appColors.textPrimary,
  },
  inputError: {
    borderColor: appColors.danger,
  },
  inputMultiline: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  errorText: {
    color: appColors.danger,
    fontSize: 12,
    marginTop: 5,
  },
});

export default FormInput;
