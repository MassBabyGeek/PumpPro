import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';
import {useAuth} from '../../../hooks/useAuth';

type Props = {
  isLoading: boolean;
};

const SocialLoginSection = ({isLoading}: Props) => {
  const {loginWithGoogle, loginWithApple} = useAuth();
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingApple, setLoadingApple] = useState(false);

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    try {
      await loginWithGoogle();
      Toast.show({
        type: 'success',
        text1: 'Connexion réussie! 🎉',
        text2: 'Bienvenue',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: error instanceof Error ? error.message : 'Connexion avec Google échouée',
      });
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleAppleLogin = async () => {
    if (Platform.OS !== 'ios') {
      Toast.show({
        type: 'error',
        text1: 'Non disponible',
        text2: 'La connexion Apple n\'est disponible que sur iOS',
      });
      return;
    }

    setLoadingApple(true);
    try {
      await loginWithApple();
      Toast.show({
        type: 'success',
        text1: 'Connexion réussie! 🎉',
        text2: 'Bienvenue',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: error instanceof Error ? error.message : 'Connexion avec Apple échouée',
      });
    } finally {
      setLoadingApple(false);
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

      {/* Social buttons */}
      <TouchableOpacity
        style={styles.socialButton}
        disabled={isLoading || loadingGoogle}
        onPress={handleGoogleLogin}>
        <Icon name="logo-google" size={20} color={appColors.textPrimary} />
        <Text style={styles.socialButtonText}>
          {loadingGoogle ? 'Connexion...' : 'Continuer avec Google'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.socialButton}
        disabled={isLoading || loadingApple}
        onPress={handleAppleLogin}>
        <Icon name="logo-apple" size={20} color={appColors.textPrimary} />
        <Text style={styles.socialButtonText}>
          {loadingApple ? 'Connexion...' : 'Continuer avec Apple'}
        </Text>
      </TouchableOpacity>
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
    backgroundColor: `${appColors.border}40`,
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
});

export default SocialLoginSection;
