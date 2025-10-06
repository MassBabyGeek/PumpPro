import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';
import GradientButton from '../../components/GradientButton/GradientButton';

type ForgotPasswordScreenProps = {
  navigation: any;
};

const ForgotPasswordScreen = ({navigation}: ForgotPasswordScreenProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Erreur', 'Veuillez entrer votre email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide');
      return;
    }

    setIsLoading(true);

    // Simulation d'appel API
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Email envoyé! 📧',
        'Un lien de réinitialisation a été envoyé à votre adresse email.',
        [{text: 'OK', onPress: () => navigation.goBack()}],
      );
    }, 1500);
  };

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.container}>
      <View style={styles.scrollContent}>
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={appColors.textPrimary} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon name="lock-closed" size={40} color={appColors.primary} />
          </View>
          <Text style={styles.title}>Mot de passe oublié?</Text>
          <Text style={styles.subtitle}>
            Pas de problème! Entrez votre email et nous vous enverrons un lien
            pour réinitialiser votre mot de passe.
          </Text>
        </View>

        {/* Form */}
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
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <GradientButton
            text="Envoyer le lien de réinitialisation"
            icon="send"
            onPress={handleResetPassword}
            isLoading={isLoading}
            disabled={isLoading}
            style={styles.resetButtonContainer}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.footerText}>
              Vous vous souvenez de votre mot de passe?{' '}
              <Text style={styles.footerLink}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${appColors.border}50`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${appColors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: appColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${appColors.border}40`,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: appColors.border,
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
  resetButtonContainer: {
    marginBottom: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontSize: 14,
    color: appColors.textSecondary,
  },
  footerLink: {
    color: appColors.primary,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;
