import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';
import {useAuth} from '../../../hooks/useAuth';
import {useToast} from '../../../hooks';

type SocialLoginSectionProps = {
  isLoading: boolean;
};

const SocialLoginSection = ({isLoading}: SocialLoginSectionProps) => {
  const {loginWithGoogle, loginWithApple} = useAuth();
  const {toastError, toastSuccess} = useToast();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toastSuccess('Connexion réussie !', 'Bienvenue avec Google 🎉');
    } catch (error) {
      console.error('[SocialLogin] Google error:', error);
      toastError(
        'Connexion Google échouée',
        error instanceof Error ? error.message : 'Erreur inconnue',
      );
    }
  };

  const handleAppleLogin = async () => {
    try {
      await loginWithApple();
      toastSuccess('Connexion réussie !', 'Bienvenue avec Apple 🎉');
    } catch (error) {
      console.error('[SocialLogin] Apple error:', error);

      // Error 1000 = configuration issue or cancelled
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';

      if (errorMessage.includes('1000') || errorMessage.includes('authorization')) {
        toastError(
          'Apple Sign-In non disponible',
          'Configuration en cours. Utilisez Google ou email pour vous connecter.',
        );
      } else {
        toastError('Connexion Apple échouée', errorMessage);
      }
    }
  };

  return (
    <>
      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OU</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Google Login */}
      <TouchableOpacity
        style={[styles.socialButton, isLoading && styles.socialButtonDisabled]}
        onPress={handleGoogleLogin}
        disabled={isLoading}>
        <Icon
          name="logo-google"
          size={20}
          color={isLoading ? appColors.textSecondary : '#DB4437'}
        />
        <Text style={[styles.socialButtonText, isLoading && styles.socialButtonTextDisabled]}>
          Continuer avec Google
        </Text>
      </TouchableOpacity>

      {/* Apple Login - Disabled: Requires paid Apple Developer account */}
      {/* Sign In with Apple is not supported with Personal Team (free) accounts */}
      {/* Uncomment when you have a paid Apple Developer account (99$/year) */}
      {/* Platform.OS === 'ios' && (
        <TouchableOpacity
          style={[styles.socialButton, isLoading && styles.socialButtonDisabled]}
          onPress={handleAppleLogin}
          disabled={isLoading}>
          <Icon
            name="logo-apple"
            size={20}
            color={isLoading ? appColors.textSecondary : appColors.textPrimary}
          />
          <Text style={[styles.socialButtonText, isLoading && styles.socialButtonTextDisabled]}>
            Continuer avec Apple
          </Text>
        </TouchableOpacity>
      ) */}
    </>
  );
};

const styles = StyleSheet.create({
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: appColors.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 13,
    color: appColors.textSecondary,
    fontWeight: '600',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: appColors.backgroundLight,
    borderWidth: 1.5,
    borderColor: appColors.border,
    gap: 12,
    marginBottom: 12,
  },
  socialButtonText: {
    fontSize: 15,
    color: appColors.textPrimary,
    fontWeight: '600',
  },
  socialButtonDisabled: {
    backgroundColor: `${appColors.border}30`,
    borderColor: `${appColors.border}50`,
  },
  socialButtonTextDisabled: {
    color: appColors.textSecondary,
  },
});

export default SocialLoginSection;
