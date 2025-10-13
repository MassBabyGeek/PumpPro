import React, {useState} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import appColors from '../../assets/colors';
import {useAuth} from '../../hooks/useAuth';
import AuthFooter from '../../components/AuthFooter';
import LoginHeader from './component/LoginHeader';
import LoginForm from './component/LoginForm';
import SocialLoginSection from './component/SocialLoginSection';

type LoginScreenProps = {
  navigation: any;
};

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const {login} = useAuth();
  const [email, setEmail] = useState('l@outlook.fr');
  const [password, setPassword] = useState('aaaaaa');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Veuillez remplir tous les champs',
      });
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      Toast.show({
        type: 'success',
        text1: 'Connexion réussie! 🎉',
        text2: 'Bienvenue',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: error instanceof Error ? error.message : 'Connexion échouée',
      });
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
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onForgotPassword={handleForgotPassword}
          onLogin={handleLogin}
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
