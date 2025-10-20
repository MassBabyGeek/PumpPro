/* eslint-disable no-catch-shadow */
import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import appColors from '../../assets/colors';
import {useAuth} from '../../hooks/useAuth';
import AuthFooter from '../../components/AuthFooter';
import LoginHeader from './component/LoginHeader';
import LoginForm from './component/LoginForm';
import SocialLoginSection from './component/SocialLoginSection';
import {useToast} from '../../hooks';
import {credentialsStorage} from '../../services/credentialsStorage';

type LoginScreenProps = {
  navigation: any;
};

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const {login} = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved credentials on mount
  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const shouldRemember = await credentialsStorage.getRememberMe();
      if (shouldRemember) {
        const credentials = await credentialsStorage.getSavedCredentials();
        if (credentials) {
          setEmail(credentials.email);
          setPassword(credentials.password);
          setRememberMe(true);
        }
      }
    } catch (error) {
      console.error('[LoginScreen] Error loading credentials:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.toastWarning('Champs requis', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);

      // Save or clear credentials based on remember me checkbox
      if (rememberMe) {
        await credentialsStorage.saveCredentials(email, password);
        await credentialsStorage.setRememberMe(true);
      } else {
        await credentialsStorage.clearCredentials();
        await credentialsStorage.setRememberMe(false);
      }

      toast.toastSuccess('Connexion réussie !', 'Bienvenue 🎉');
    } catch (error) {
      toast.toastError(
        'Connexion échouée',
        error instanceof Error ? error.message : 'Erreur inconnue',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <LoginHeader />

        <LoginForm
          email={email}
          password={password}
          showPassword={showPassword}
          isLoading={isLoading}
          rememberMe={rememberMe}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onForgotPassword={handleForgotPassword}
          onLogin={handleLogin}
          onRememberMeChange={setRememberMe}
        />

        <SocialLoginSection isLoading={isLoading} />

        <AuthFooter
          text="Pas encore de compte?"
          linkText="S'inscrire"
          onLinkPress={() => navigation.navigate('SignUp')}
          disabled={isLoading}
        />
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
});

export default LoginScreen;
