import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';
import {useAuth} from '../../hooks/useAuth';
import GradientButton from '../../components/GradientButton/GradientButton';

type LoginScreenProps = {
  navigation: any;
};

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const {login} = useAuth();
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('test');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : 'Connexion échouée',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Header avec Logo centré */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[appColors.primary, appColors.accent]}
              style={styles.logoGradient}>
              <Icon name="fitness" size={60} color="#fff" />
            </LinearGradient>
          </View>
          <Text style={styles.title}>Bon retour! 👋</Text>
          <Text style={styles.subtitle}>Connecte-toi pour continuer</Text>
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
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
              disabled={isLoading}>
              <Icon
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={appColors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            disabled={isLoading}>
            <Text style={styles.forgotPassword}>Mot de passe oublié?</Text>
          </TouchableOpacity>

          <GradientButton
            text="Se connecter"
            icon="arrow-forward"
            onPress={handleLogin}
            isLoading={isLoading}
            disabled={isLoading}
            style={styles.loginButtonContainer}
          />

          {/* Info de test */}
          <View style={styles.testInfo}>
            <Text style={styles.testInfoText}>
              💡 Test: test@test.com / test
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OU</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social buttons */}
          <TouchableOpacity
            style={styles.socialButton}
            disabled={isLoading}
            onPress={() => Alert.alert('Info', 'Fonctionnalité à venir')}>
            <Icon name="logo-google" size={20} color={appColors.textPrimary} />
            <Text style={styles.socialButtonText}>Continuer avec Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            disabled={isLoading}
            onPress={() => Alert.alert('Info', 'Fonctionnalité à venir')}>
            <Icon name="logo-apple" size={20} color={appColors.textPrimary} />
            <Text style={styles.socialButtonText}>Continuer avec Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            disabled={isLoading}>
            <Text style={styles.footerText}>
              Pas encore de compte?{' '}
              <Text style={styles.footerLink}>S'inscrire</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: appColors.primary,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: appColors.textSecondary,
    textAlign: 'center',
  },
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
  forgotPassword: {
    fontSize: 14,
    color: appColors.primary,
    textAlign: 'right',
    fontWeight: '600',
    marginBottom: 24,
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
  footer: {
    alignItems: 'center',
    paddingTop: 32,
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

export default LoginScreen;
