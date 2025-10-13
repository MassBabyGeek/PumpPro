import React, {useState} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import appColors from '../../assets/colors';
import {useAuth} from '../../hooks/useAuth';
import AuthFooter from '../../components/AuthFooter';
import SignUpHeader from './component/SignUpHeader';
import SignUpForm from './component/SignUpForm';
import SocialLoginSection from '../LoginScreen/component/SocialLoginSection';

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
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Veuillez remplir tous les champs',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Les mots de passe ne correspondent pas',
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Le mot de passe doit contenir au moins 6 caractères',
      });
      return;
    }

    if (!acceptTerms) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Veuillez accepter les conditions d\'utilisation',
      });
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, name);
      Toast.show({
        type: 'success',
        text1: 'Bienvenue! 🎉',
        text2: 'Votre compte a été créé avec succès',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: error instanceof Error ? error.message : 'Inscription échouée',
      });
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
        <SignUpHeader onBack={() => navigation.goBack()} />

        <SignUpForm
          name={name}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          acceptTerms={acceptTerms}
          isLoading={isLoading}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
          onToggleTerms={() => setAcceptTerms(!acceptTerms)}
          onSignUp={handleSignUp}
        />

        <SocialLoginSection isLoading={isLoading} />

        <AuthFooter
          text="Déjà un compte?"
          linkText="Se connecter"
          onLinkPress={() => navigation.navigate('Login')}
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

export default SignUpScreen;
