import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';
import GradientButton from '../../../components/GradientButton/GradientButton';

type Props = {
  email: string;
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  rememberMe: boolean;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onTogglePassword: () => void;
  onForgotPassword: () => void;
  onLogin: () => void;
  onRememberMeChange: (value: boolean) => void;
};

const LoginForm = ({
  email,
  password,
  showPassword,
  isLoading,
  rememberMe,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onForgotPassword,
  onLogin,
  onRememberMeChange,
}: Props) => {
  return (
    <View style={styles.form}>
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
          editable={!isLoading}
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
          editable={!isLoading}
        />
        <TouchableOpacity
          onPress={onTogglePassword}
          style={styles.eyeIcon}
          disabled={isLoading}>
          <Icon
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={appColors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={styles.rememberMeContainer}
          onPress={() => onRememberMeChange(!rememberMe)}
          disabled={isLoading}>
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && (
              <Icon name="checkmark" size={16} color={appColors.background} />
            )}
          </View>
          <Text style={styles.rememberMeText}>Se souvenir de moi</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onForgotPassword} disabled={isLoading}>
          <Text style={styles.forgotPassword}>Mot de passe oublié?</Text>
        </TouchableOpacity>
      </View>

      <GradientButton
        text="Se connecter"
        icon="arrow-forward"
        onPress={onLogin}
        isLoading={isLoading}
        disabled={isLoading}
        style={styles.loginButtonContainer}
      />

      {/* Info de test */}
      <View style={styles.testInfo}>
        <Text style={styles.testInfoText}>
          💡 Pompeur Pro ne demandera jamais vos identifiants !
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    marginBottom: 32,
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: appColors.border,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  rememberMeText: {
    fontSize: 14,
    color: appColors.textPrimary,
    fontWeight: '500',
  },
  forgotPassword: {
    fontSize: 14,
    color: appColors.primary,
    fontWeight: '600',
  },
  loginButtonContainer: {
    marginBottom: 16,
  },
  testInfo: {
    backgroundColor: `${appColors.primary}15`,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: `${appColors.primary}30`,
  },
  testInfoText: {
    fontSize: 13,
    color: appColors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default LoginForm;
