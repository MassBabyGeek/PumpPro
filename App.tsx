import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthStack from './src/components/Stacks/AuthStack/AuthStack';
import AppStack from './src/components/Stacks/AppStack/AppStack';
import SplashScreen from './src/screens/SplashScreen/SplashScreen';

const AUTH_KEY = '@pompeurpro_auth';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authStatus = await AsyncStorage.getItem(AUTH_KEY);
      setIsAuthenticated(authStatus === 'true');
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      await AsyncStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving auth status:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_KEY);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error removing auth status:', error);
    }
  };

  // Afficher le splash screen pendant le chargement
  if (isLoading || showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppStack onLogout={handleLogout} />
      ) : (
        <AuthStack onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
}
