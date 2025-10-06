import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';
import {useAuth} from '../../hooks/useAuth';
import GradientButton from '../../components/GradientButton/GradientButton';

type SignUpScreenProps = {
  navigation: any;
};

const SignUpScreen = ({navigation}: SignUpScreenProps) => {
  const {register} = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (!acceptTerms) {
      Alert.alert('Erreur', 'Veuillez accepter les conditions d\'utilisation');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, name);
      Alert.alert('Bienvenue! 🎉', 'Votre compte a été créé avec succès');
    } catch (error) {
      Alert.alert('Erreur', error instanceof Error ? error.message : 'Inscription échouée');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={appColors.textPrimary} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={[appColors.primary, appColors.accent]}
                style={styles.logoGradient}>
                <Icon name="fitness" size={50} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Créer un compte 💪</Text>
            <Text style={styles.subtitle}>
              Rejoins la communauté PompeurPro
            </Text>
          </View>

          {/* Form */}
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
                onChangeText={setName}
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
                onChangeText={setEmail}
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
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}>
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
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}>
                <Icon
                  name={
                    showConfirmPassword ? 'eye-off-outline' : 'eye-outline'
                  }
                  size={20}
                  color={appColors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Terms checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}>
              <View
                style={[
                  styles.checkbox,
                  acceptTerms && styles.checkboxActive,
                ]}>
                {acceptTerms && (
                  <Icon name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.checkboxText}>
                J'accepte les{' '}
                <Text style={styles.link}>conditions d'utilisation</Text> et la{' '}
                <Text style={styles.link}>politique de confidentialité</Text>
              </Text>
            </TouchableOpacity>

            <GradientButton
              text="Créer mon compte"
              icon="arrow-forward"
              onPress={handleSignUp}
              isLoading={isLoading}
              disabled={isLoading}
              style={styles.signUpButtonContainer}
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social buttons */}
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="logo-google" size={20} color={appColors.textPrimary} />
              <Text style={styles.socialButtonText}>
                Continuer avec Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <Icon name="logo-apple" size={20} color={appColors.textPrimary} />
              <Text style={styles.socialButtonText}>
                Continuer avec Apple
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerText}>
                Déjà un compte?{' '}
                <Text style={styles.footerLink}>Se connecter</Text>
              </Text>
            </TouchableOpacity>
          </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: appColors.primary,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: appColors.textSecondary,
    textAlign: 'center',
  },
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
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
  footer: {
    alignItems: 'center',
    paddingTop: 24,
  },
  footerText: {
    fontSize: 15,
    color: appColors.textSecondary,
  },
  footerLink: {
    color: appColors.primary,
    fontWeight: '700',
  },
});

export default SignUpScreen;
