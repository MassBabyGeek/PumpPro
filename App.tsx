import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {AuthProvider} from './src/contexts/AuthContext';
import {useAuth} from './src/hooks/useAuth';
import AuthStack from './src/components/Stacks/AuthStack/AuthStack';
import AppStack from './src/components/Stacks/AppStack/AppStack';
import SplashScreen from './src/screens/SplashScreen/SplashScreen';

const AppNavigator = () => {
  const {isAuthenticated, isLoading} = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  // Afficher le splash screen pendant le chargement
  if (isLoading || showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
      <Toast />
    </AuthProvider>
  );
}
