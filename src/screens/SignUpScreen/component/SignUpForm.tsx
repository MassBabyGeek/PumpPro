import React from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';
import GradientButton from '../../../components/GradientButton/GradientButton';

type Props = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  acceptTerms: boolean;
  isLoading: boolean;
  onNameChange: (text: string) => void;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onConfirmPasswordChange: (text: string) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onToggleTerms: () => void;
  onSignUp: () => void;
};

const SignUpForm = ({
  name,
  email,
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  acceptTerms,
  isLoading,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onTogglePassword,
  onToggleConfirmPassword,
  onToggleTerms,
  onSignUp,
}: Props) => {
  return (
    <View style={styles.form}>
      <View style={styles.inputContainer}>
        <Icon
          name="person-outline"
          size={20}
          color={appColors.textSecondary}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Nom complet"
          placeholderTextColor={appColors.textSecondary}
          value={name}
          onChangeText={onNameChange}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon
          name="mail-outline"
          size={20}
          color={appColors.textSecondary}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={appColors.textSecondary}
          value={email}
          onChangeText={onEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon
          name="lock-closed-outline"
          size={20}
          color={appColors.textSecondary}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor={appColors.textSecondary}
          value={password}
          onChangeText={onPasswordChange}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={onTogglePassword} style={styles.eyeIcon}>
          <Icon
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={appColors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Icon
          name="lock-closed-outline"
          size={20}
          color={appColors.textSecondary}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmer le mot de passe"
          placeholderTextColor={appColors.textSecondary}
          value={confirmPassword}
          onChangeText={onConfirmPasswordChange}
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={onToggleConfirmPassword}
          style={styles.eyeIcon}>
          <Icon
            name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={appColors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={onToggleTerms}>
        <View style={[styles.checkbox, acceptTerms && styles.checkboxActive]}>
          {acceptTerms && <Icon name="checkmark" size={16} color="#fff" />}
        </View>
        <Text style={styles.checkboxText}>
          J'accepte les <Text style={styles.link}>conditions d'utilisation</Text>{' '}
          et la <Text style={styles.link}>politique de confidentialité</Text>
        </Text>
      </TouchableOpacity>

      <GradientButton
        text="Créer mon compte"
        icon="arrow-forward"
        onPress={onSignUp}
        isLoading={isLoading}
        disabled={isLoading}
        style={styles.signUpButtonContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${appColors.border}40`,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: appColors.border,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    color: appColors.textPrimary,
  },
  eyeIcon: {
    padding: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 4,
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: appColors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    color: appColors.textSecondary,
    lineHeight: 20,
  },
  link: {
    color: appColors.primary,
    fontWeight: '600',
  },
  signUpButtonContainer: {
    marginBottom: 16,
  },
});

export default SignUpForm;
